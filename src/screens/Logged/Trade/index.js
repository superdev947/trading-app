import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { ImageBackground, StyleSheet, TouchableOpacity } from 'react-native'
import { Tabs, Box, Icon, ScrollView, HStack, Stack, Button, Text, Input, Spinner, Center, useToast } from 'native-base'
import normalize from 'react-native-normalize'
import moment from 'moment'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { COLOR, Images, LAYOUT, LocalizationContext } from '../../../constants'
import { Headers } from '../../../components'
import { useApi } from '../../../redux/services'


const TradeScreen = ({ navigation }) => {
    const { t } = useContext(LocalizationContext)
    const Api = useApi()
    const Toast = useToast()
    const [activeTabO, setActiveTabO] = useState(true)
    const [loading, setLoading] = useState(false)
    const { type, activeData } = navigation.state.params
    const { address: Myaddress, user } = useSelector(state => state.auth)
    const [activeType, setActiveType] = useState(type === 'buy')
    const [orderListV2, setOrderListV2] = useState(LAYOUT.initListV2)
    const [assets, setAssets] = useState([])
    const [latestOrders, setLatestOrders] = useState([])
    const [myOrders, setMyOrders] = useState([])
    const [currentOrders, setCurrentOrders] = useState([])
    const [price, setPrice] = useState(0)
    const [amount, setAmount] = useState(0)
    const [balance, setBalance] = useState(0)
    const isPlus = parseFloat(activeData.gain) * 100 > 0

    const LoadOrderListV2 = () => {
        Api.LoadOrderListV2({ exchange_id: activeData.id }).then(({ data }) => {
            if (data.data) {
                setOrderListV2(data.data)
            } else {
                setOrderListV2(LAYOUT.initListV2)
            }
        }).catch(error => {
            console.log(`LoadOrderListV2`, error)
        })
    }

    const loadAssets = () => {
        Api.LoadAccountAssets({ address: Myaddress }).then(res => {
            setAssets(res.data.data)
        }).catch(error => {
            console.log(`LoadAccountAssets`, error)
        })
    }

    const LoadLatestOrders = () => {
        Api.LoadLatestOrders({ pairID: activeData.id, limit: 25 }).then(({ data }) => {
            if (data?.data?.rows) {
                setLatestOrders(data.data.rows)
            }
        }).catch(error => {
            console.log(`LoadLatestOrders`, error)
        })
    }

    const LoadOrders = () => {
        Api.LoadMyOrders({ uAddr: Myaddress }).then(({ data }) => {
            if (data.data) {
                setMyOrders(data.data)
            }
        }).catch(error => {
            console.log(`LoadMyOrders`, error)
        })
        Api.LoadCurrentOrders({ uAddr: Myaddress }).then(({ data }) => {
            if (data.data) {
                setCurrentOrders(data.data)
            }
        }).catch(error => {
            console.log(`LoadCurrentOrders`, error)
        })
    }

    const onHandleBalance = () => {
        setPrice(!activeType ? orderListV2.buy[0].Price : orderListV2.sell[0].Price)
        const pair = activeType ? activeData.sShortName : activeData.fShortName
        const adata = assets.find(e => e?.token_abbr.toLowerCase() === pair.toLowerCase())
        setBalance(adata ? adata.balance : 0)
    }

    const onHandelPrice = (params, type) => {
        if (type === 'buy' && !activeType) {
            setPrice(params.Price)
        } else if (type === 'sell' && activeType) {
            setPrice(params.Price)
        }
    }

    const onBuyAndSell = () => {
        const { fPrecision, sPrecision, fTokenAddr, sTokenAddr, pairType } = activeData
        if (pairType == 1 || pairType == 2) {
            if (price * amount < 10) {
                Toast.show({ title: t('Total ≥ 10 TRX'), status: "danger", placement: 'bottom' })
                return
            }
        } else {
            if (price * amount < 1) {
                Toast.show({ title: t('Total ≥ 1 USDT'), status: "danger", placement: 'bottom' })
                return
            }
        }

        if (!price || !amount) { return }

        const firstPrecision = Math.pow(10, fPrecision || 8)
        const secondPrecision = Math.pow(10, sPrecision || 8)
        const data = {
            user_id: user._id,
            address: Myaddress,
            tokenA: fTokenAddr,
            tokenB: sTokenAddr,
            amountA: amount * firstPrecision,
            amountB: amount * price * secondPrecision,
            price: price * secondPrecision,
            amountUsdt: 100,
            pairType: pairType,
            type: activeType ? 'buy' : 'sell',
        }
        setLoading(true)
        Api.BuyAndSellByContract(data).then(({ data }) => {
            setLoading(false)
            reload()
            Toast.show({ title: data.data, status: "success", placement: 'bottom' })
        }).catch(error => {
            setLoading(false)
            console.log(`BuyByContract`, error)
        })
    }

    const onCancelOrder = (params) => {
        const req = {
            _id: params.orderID,
            address: Myaddress,
            pairType: params.pairType
        }
        Api.CancelOrder(req).then(({ data }) => {
            Toast.show({ title: data.data, status: "success", placement: 'bottom' })
            reload()
        }).catch(error => {
            console.log(`CancelOrder`, error)
        })
    }

    const reload = (params) => {
        loadAssets()
        LoadOrderListV2()
        LoadLatestOrders()
        LoadOrders()
        onHandleBalance()
    }


    useEffect(() => {
        onHandleBalance()
    }, [activeType, assets, orderListV2])


    useEffect(() => {
        reload()
    }, [navigation, activeTabO])



    return (
        <Box flex={1} bg={COLOR.primary} w='100%'>
            <Headers
                title={t('Trade')}
                left={
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon as={<MaterialCommunityIcons name='chevron-left' />} size='sm' color={COLOR.white} />
                    </TouchableOpacity>
                }
            />
            <Tabs isFitted px={2}>
                <Tabs.Bar>
                    <Tabs.Tab>{t('Trade')}</Tabs.Tab>
                    <Tabs.Tab>{t('Orders')}</Tabs.Tab>
                </Tabs.Bar>
                <Tabs.Views>
                    <Tabs.View>
                        <HStack space={2}>
                            <Stack w={'50%'}>
                                <Text fontSize='md' color={COLOR.white}>{`${activeData.fShortName}/${activeData.sTokenName}`}</Text>
                                <HStack mt={2} justifyContent='space-between'>
                                    <TouchableOpacity onPress={() => setActiveType(true)}>
                                        <ImageBackground
                                            source={activeType ? Images.Buy : Images.Buy1}
                                            resizeMode='contain'
                                            style={{
                                                width: normalize(85),
                                                height: normalize(30),
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Text fontSize='sm' color={activeType ? COLOR.white : COLOR.grey}>{t('Buy')}</Text>
                                        </ImageBackground>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setActiveType(false)}>
                                        <ImageBackground
                                            source={!activeType ? Images.Sell : Images.Sell1}
                                            resizeMode='contain'
                                            style={{
                                                width: normalize(85),
                                                height: normalize(30),
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Text fontSize='sm' color={!activeType ? COLOR.white : COLOR.grey}>{t('Sell')}</Text>
                                        </ImageBackground>
                                    </TouchableOpacity>
                                </HStack>
                                <Input
                                    p={1}
                                    mt={2}
                                    w='100%'
                                    size='sm'
                                    type='text'
                                    variant='underlined'
                                    placeholder={t('Price')}
                                    autoCapitalize={'none'}
                                    keyboardType='numeric'
                                    value={String(price)}
                                    onChangeText={setPrice}
                                    color={COLOR.white}
                                    borderBottomColor={COLOR.inputBorberColor}
                                    placeholderTextColor={COLOR.inputLabelColor}
                                />
                                <Input
                                    p={1}
                                    mt={2}
                                    w='100%'
                                    size='sm'
                                    type='text'
                                    variant='underlined'
                                    placeholder={t('Amount')}
                                    autoCapitalize={'none'}
                                    keyboardType='numeric'
                                    value={String(amount)}
                                    onChangeText={setAmount}
                                    color={COLOR.white}
                                    borderBottomColor={COLOR.inputBorberColor}
                                    placeholderTextColor={COLOR.inputLabelColor}
                                />
                                <HStack bg={COLOR.primary} justifyContent='space-between' alignItems='center' mt={2} py={2}>
                                    <Text fontSize='xs' color={COLOR.grey} w='30%'>{t('Total')}</Text>
                                    <Text fontSize='xs' color={COLOR.white} isTruncated w='70%' textAlign='right'>{(price * amount).toFixed(6)} {activeData.sShortName}</Text>
                                </HStack>
                                <HStack bg={COLOR.primary} justifyContent='space-between' alignItems='center' mt={2} py={2}>
                                    <Text fontSize='xs' color={COLOR.grey} w='30%'>{t('Balance')}</Text>
                                    <Text fontSize='xs' color={COLOR.white} isTruncated w='70%' textAlign='right'>{balance} {activeType ? activeData.sShortName : activeData.fShortName}</Text>
                                </HStack>
                                <Button
                                    mt={2}
                                    shadow={1}
                                    borderRadius={2}
                                    size='sm'
                                    disabled={loading}
                                    colorScheme={activeType ? 'success' : 'danger'}
                                    bg={activeType ? COLOR.success : COLOR.danger}
                                    onPress={onBuyAndSell}
                                >
                                    {
                                        loading ?
                                            <Spinner size="sm" ml={1} color={COLOR.white} /> :
                                            <Text fontSize='sm' bold color={COLOR.white}>{`${activeType ? 'BUY' : 'SELL'} ${activeData.sShortName}`}</Text>
                                    }
                                </Button>
                            </Stack>
                            <Stack w={'50%'}>
                                <HStack
                                    mb={1}
                                    borderBottomWidth={1}
                                    borderColor={COLOR.grey}
                                    justifyContent='space-between'
                                >
                                    <Text fontSize='xs' color={COLOR.grey}> {t('Amount')}({activeData.fShortName}) </Text>
                                    <Text fontSize='xs' color={COLOR.grey}> {t('Price')}({activeData.sShortName}) </Text>
                                </HStack>
                                {
                                    orderListV2.sell.slice(0, 7).reverse().map((data, key) => (
                                        <TouchableOpacity
                                            key={key}
                                            onPress={() => onHandelPrice(data, 'sell')}
                                        >
                                            <HStack justifyContent='space-between'>
                                                <Text fontSize='xs' color={COLOR.white}>{data.Amount}</Text>
                                                <Text fontSize='xs' color={COLOR.danger}>{parseFloat(data.Price).toFixed(6)}</Text>
                                            </HStack>
                                        </TouchableOpacity>
                                    ))
                                }
                                <Text
                                    my={2}
                                    py={1}
                                    bold
                                    borderTopWidth={1}
                                    borderBottomWidth={1}
                                    borderColor={COLOR.grey}
                                    color={isPlus ? COLOR.success : COLOR.danger}
                                    fontSize='md'
                                    textAlign='center'
                                >
                                    {parseFloat(orderListV2.price / Math.pow(10, activeData.sPrecision)).toFixed(6)}  {isPlus ? '↑' : '↓'}
                                </Text>
                                {
                                    orderListV2.buy.slice(0, 7).map((data, key) => (
                                        <TouchableOpacity
                                            key={key}
                                            onPress={() => onHandelPrice(data, 'buy')}
                                        >
                                            <HStack justifyContent='space-between'>
                                                <Text fontSize='xs' color={COLOR.white}>{data.Amount}</Text>
                                                <Text fontSize='xs' color={COLOR.success}>{parseFloat(data.Price).toFixed(6)}</Text>
                                            </HStack>
                                        </TouchableOpacity>
                                    ))
                                }
                            </Stack>
                        </HStack>
                        <Text fontSize='sm' mt={1} color={COLOR.white}>{t('Trade History')}</Text>
                        <HStack my={1} borderBottomWidth={1} borderColor={COLOR.grey}>
                            <Text fontSize='xs' color={COLOR.grey} w='33%'>{t('Time')}</Text>
                            <Text fontSize='xs' color={COLOR.grey} w='33%'>{t('Price')}({activeData.sShortName})</Text>
                            <Text fontSize='xs' color={COLOR.grey} w='33%' textAlign='right'>{t('Amount')}({activeData.fShortName})</Text>
                        </HStack>
                        <ScrollView h={150} showsVerticalScrollIndicator={false}>
                            {
                                latestOrders.map((data, key) => (
                                    <HStack justifyContent='space-between' key={key}>
                                        <Text fontSize='xs' w='33%' color={COLOR.white}>{moment(parseInt(data.orderTime)).format('hh:mm:ss')}</Text>
                                        <Text fontSize='xs' w='33%' color={data.order_type == 1 ? COLOR.danger : COLOR.success}>{data.price.toFixed(6)}</Text>
                                        <Text fontSize='xs' w='33%' color={COLOR.white} textAlign='right'>{data.volume}</Text>
                                    </HStack>
                                ))
                            }
                        </ScrollView>
                    </Tabs.View>
                    <Tabs.View>
                        <Center>
                            <Button.Group
                                isAttached
                                variant="solid"
                                mx={{ base: "auto", md: 0 }}
                                space={0}
                            >
                                <Button
                                    size='sm'
                                    colorScheme="teal"
                                    borderWidth={1}
                                    borderColor={!activeTabO ? COLOR.grey : COLOR.success}
                                    bg={!activeTabO ? 'transparent' : COLOR.success}
                                    borderRadius={0}
                                    onPress={() => setActiveTabO(true)}
                                >
                                    <Text fontSize='xs' color={COLOR.white}>{t('Current Order')}</Text>
                                </Button>
                                <Button
                                    size='sm'
                                    colorScheme="teal"
                                    borderWidth={1}
                                    borderColor={activeTabO ? COLOR.grey : COLOR.success}
                                    bg={activeTabO ? 'transparent' : COLOR.success}
                                    borderRadius={0}
                                    onPress={() => setActiveTabO(false)}
                                >

                                    <Text fontSize='xs' color={COLOR.white}>{t('My Tradings')}</Text>
                                </Button>
                            </Button.Group>
                        </Center>
                        <ScrollView height={LAYOUT.window.height - normalize(200)} showsVerticalScrollIndicator={false}>
                            {
                                activeTabO ?
                                    currentOrders.map((item, key) => {
                                        const isBuy = item.orderType === 0
                                        return (
                                            <Stack
                                                py={2}
                                                px={1}
                                                key={key}
                                                borderColor={COLOR.grey}
                                                borderBottomWidth={StyleSheet.hairlineWidth}
                                            >
                                                <HStack justifyContent='space-between'>
                                                    <HStack alignItems='center' space={1}>
                                                        <Center w={4} h={4} bg={isBuy ? COLOR.success : COLOR.danger}>
                                                            <Text fontSize='xs' color={COLOR.white}>{isBuy ? 'B' : 'S'}</Text>
                                                        </Center>
                                                        <Text fontSize='xs' color={COLOR.white}>{`${item.fShortName}/${item.sShortName}`}</Text>
                                                    </HStack>
                                                    {item.orderStatus === 0 ? (
                                                        <TouchableOpacity onPress={() => onCancelOrder(item)}>
                                                            <Text fontSize='xs' color={COLOR.success}>{t('Cancel')}</Text>
                                                        </TouchableOpacity>
                                                    ) : null}
                                                </HStack>
                                                <HStack justifyContent='space-between' mt={2}>
                                                    <Stack>
                                                        <Text fontSize='xs' color={COLOR.grey}>{t('Time')}</Text>
                                                        <Text fontSize='xs' color={COLOR.white} mt={1}>{moment(parseInt(item.orderTime)).format('MM-DD hh:mm:ss')}</Text>
                                                    </Stack>
                                                    <Stack>
                                                        <Text fontSize='xs' color={COLOR.grey}>{t('Price')}</Text>
                                                        <Text fontSize='xs' color={COLOR.white} mt={1}>{item.price}</Text>
                                                    </Stack>
                                                    <Stack>
                                                        <Text fontSize='xs' color={COLOR.grey}>{t('Amount')}</Text>
                                                        <Text fontSize='xs' color={COLOR.white} mt={1}>{item.volume}</Text>
                                                    </Stack>
                                                    <Stack>
                                                        <Text fontSize='xs' color={COLOR.grey}>{t('Progress')}</Text>
                                                        <Text fontSize='xs' color={COLOR.white} mt={1} textAlign='right'>{`${(parseFloat(item.schedule) * 100).toFixed(2)}%`}</Text>
                                                    </Stack>
                                                </HStack>
                                            </Stack>
                                        )
                                    })
                                    :
                                    myOrders.map((item, key) => {
                                        const isBuy = item.orderType === 0
                                        return (
                                            <Stack
                                                py={2}
                                                px={1}
                                                key={key}
                                                borderColor={COLOR.grey}
                                                borderBottomWidth={StyleSheet.hairlineWidth}
                                            >
                                                <HStack justifyContent='space-between'>
                                                    <HStack alignItems='center' space={1}>
                                                        <Center w={4} h={4} bg={isBuy ? COLOR.success : COLOR.danger}>
                                                            <Text fontSize='xs' color={COLOR.white}>{isBuy ? 'B' : 'S'}</Text>
                                                        </Center>
                                                        <Text fontSize='xs' color={COLOR.white}>{`${item.fShortName}/${item.sShortName}`}</Text>
                                                    </HStack>
                                                    {item.orderStatus === 2 ? (
                                                        <Text fontSize='xs' color={COLOR.success}>{t('Completed')}</Text>
                                                    ) : null}
                                                    {item.orderStatus === 7 ? (
                                                        <Text fontSize='xs' color={COLOR.grey}>{t('Canceled')}</Text>
                                                    ) : null}
                                                </HStack>
                                                <HStack justifyContent='space-between' mt={2}>
                                                    <Stack>
                                                        <Text fontSize='xs' color={COLOR.grey}>{t('Time')}</Text>
                                                        <Text fontSize='xs' color={COLOR.white} mt={1}>{moment(parseInt(item.orderTime)).format('MM-DD hh:mm:ss')}</Text>
                                                    </Stack>
                                                    <Stack>
                                                        <Text fontSize='xs' color={COLOR.grey}>{t('Price')}</Text>
                                                        <Text fontSize='xs' color={COLOR.white} mt={1}>{item.price}</Text>
                                                    </Stack>
                                                    <Stack>
                                                        <Text fontSize='xs' color={COLOR.grey}>{t('Amount')}</Text>
                                                        <Text fontSize='xs' color={COLOR.white} mt={1}>{item.volume}</Text>
                                                    </Stack>
                                                    <Stack>
                                                        <Text fontSize='xs' color={COLOR.grey}>{t('Progress')}</Text>
                                                        <Text fontSize='xs' color={COLOR.white} mt={1} textAlign='right'>{`${(parseFloat(item.schedule) * 100).toFixed(2)}%`}</Text>
                                                    </Stack>
                                                </HStack>
                                            </Stack>
                                        )
                                    })
                            }
                        </ScrollView>
                    </Tabs.View>
                </Tabs.Views>
            </Tabs>
        </Box >
    )
}

export default TradeScreen