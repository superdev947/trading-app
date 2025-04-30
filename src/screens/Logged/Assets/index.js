import React, { useEffect, useState, Fragment, useContext } from 'react'
import { useSelector } from 'react-redux'
import { TouchableOpacity, Share, ImageBackground } from 'react-native'
import { Box, Stack, useToast, Icon, HStack, Text, Progress, Button, FlatList, Image, Center, Modal, useClipboard, Input, Spinner } from 'native-base'
import { MaterialCommunityIcons, Feather, MaterialIcons } from '@expo/vector-icons'
import Carousel from 'react-native-snap-carousel'
import normalize from 'react-native-normalize'
import QRCode from 'react-native-qrcode-svg'
import { Footers, Headers, UserAvatars } from '../../../components'
import { COLOR, LAYOUT, Images, LocalizationContext } from '../../../constants'
import { useApi } from '../../../redux/services'

const initCarousel = {
    title: `Total Assets (${LAYOUT.currency})`,
    bakcground: Images.Assets2,
    amount: 0,
    usdAmount: 0,
}

export default ({ navigation }) => {
    const { t } = useContext(LocalizationContext)
    const Api = useApi()
    const Toast = useToast()
    const { onCopy, hasCopied } = useClipboard()
    const { user, address } = useSelector(state => state.auth)
    const [carousel, setCarousel] = useState(initCarousel)
    const [visibleDeposit, setVisibleDeposit] = useState(false)
    const [visibleWithdraw, setVisibleWithdraw] = useState(false)
    const [price, setPrice] = useState({})
    const [assets, setAssets] = useState([])
    const [selected, setSelected] = useState({})
    const [refresh, setRefresh] = useState(false)
    const [loading, setLoading] = useState(false)
    const [bandwidth, setBandwidth] = useState(0)
    const [to_address, setAddress] = useState('')
    const [amount, setAmount] = useState('')
    let csls = null

    const loadAssets = () => {
        setRefresh(true)
        LoadPrice()
        setAssets([])
        Api.LoadAccountAssets({ address: address }).then(res => {
            if (res.data.data)
                setAssets(res.data.data)
            setBandwidth(res.data.bandwidth)
            const total = res.data.data.reduce((sum, current) => sum + Number(current.token_price * current.balance), 0)
            setCarousel({ ...carousel, amount: total })
            setRefresh(false)
        }).catch(error => {
            console.log(`LoadAccountAssets`, error)
            setRefresh(false)
        })
    }

    const LoadPrice = () => {
        Api.LoadPrice({ token: 'trx' }).then(res => {
            setPrice(res.data.data)
        }).catch(error => {
            console.log(`LoadPrice`, error)
        })
    }

    const Withdraw = () => {
        if (to_address == '') {
            Toast.show({ title: "Wrong Address!", status: "danger", placement: 'bottom' })
        } else if (amount == '' || amount == 0) {
            Toast.show({ title: "Wrong Amount!", status: "danger", placement: 'bottom' })
        } else if (Object.keys(selected).length == 0) {
            Toast.show({ title: "Wrong Token!", status: "danger", placement: 'bottom' })
        } else if (Number(amount) > Number(selected?.balance)) {
            Toast.show({ title: "Insufficient balance!", status: "danger", placement: 'bottom' })
        } else {
            setLoading(true)
            const req = {
                address: address,
                to: to_address,
                amount: Number(amount) * Math.pow(10, selected.token_decimal),
                token_id: selected.token_id,
                token_type: selected.token_type,
            }
            Api.Withdraw(req).then(res => {
                setLoading(false)
                loadAssets()
                setAmount('')
                Toast.show({ text: res.data.message, status: "success", placement: 'bottom' })
            }).catch(error => {
                console.log(error.response.data)
                setLoading(false)
                console.log(`Withdraw`, error)
            })
        }
    }

    const copyToClipboard = async () => {
        onCopy(address)
        if (hasCopied)
            Toast.show({ title: "Copied!", status: "success", placement: 'bottom' })
    }

    const onShare = async () => {
        try {
            const result = await Share.share({
                message: address
            })
            if (result.action === Share.sharedAction) {
                if (!result.activityType) {
                    console.log('shared with activity type of result.activityType')
                } else {
                    console.log('Shared!')
                }
            } else if (result.action === Share.dismissedAction) {
                console.log('dismissed')
            }
        } catch (error) {
            console.log('onShare', error.message)
        }
    }


    useEffect(() => {
        loadAssets()
    }, [navigation])

    const _renderItem = ({ item }) => (
        <ImageBackground source={item.bakcground} style={{ marginTop: normalize(10), borderRadius: normalize(20), padding: normalize(15) }}>
            <HStack alignItems='flex-end' justifyContent='space-between'>
                <Stack>
                    <Text color={COLOR.grey} fontSize='sm'>{item.title}</Text>
                    <Text color={COLOR.white} fontSize='md' bold my={2}>{item.amount.toFixed(2)}</Text>
                    <Text color={COLOR.grey} fontSize='xs'>≈ $ {(item.amount * (price.price_in_usd ? price.price_in_usd : 0)).toFixed(2)}</Text>
                </Stack>
                <Stack px={2} w='50%'>
                    <HStack justifyContent='space-between'>
                        <Text color={COLOR.grey} fontSize='xs'>{t('Bandwidth')}</Text>
                        <Text color={COLOR.grey} fontSize='xs'>{bandwidth} / 5000</Text>
                    </HStack>
                    <Progress size='xs' value={bandwidth / 50} mt={2} colorScheme="warning" />
                </Stack>
            </HStack>
            <HStack space={2} mt={2}>
                <Button
                    size='sm'
                    variant='link'
                    colorScheme='warning'
                    borderRadius={2}
                    borderWidth={1}
                    borderColor={COLOR.warning}
                    onPress={() => setVisibleDeposit(true)}
                >
                    <Text color={COLOR.warning} fontSize='xs'>{t('Deposit')}</Text>
                </Button>
                <Button
                    size='sm'
                    variant='link'
                    colorScheme='warning'
                    borderRadius={2}
                    borderWidth={1}
                    borderColor={COLOR.warning}
                    onPress={() => setVisibleWithdraw(true)}
                >
                    <Text color={COLOR.warning} fontSize='xs'>{t('Withdraw')}</Text>
                </Button>
                <Button
                    size='sm'
                    variant='link'
                    colorScheme='warning'
                    borderRadius={2}
                    borderWidth={1}
                    borderColor={COLOR.warning}
                    onPress={() => navigation.navigate('OTCScreen')}
                >
                    <Text color={COLOR.warning} fontSize='xs'>{t('OTC')}</Text>
                </Button>
            </HStack>
        </ImageBackground>
    )


    return (
        <Box flex={1} bg={COLOR.primary} w='100%'>
            <Headers
                title={t('Assets')}
                left={
                    <TouchableOpacity onPress={navigation.openDrawer}>
                        <Icon as={<MaterialCommunityIcons name='menu' />} size='sm' color={COLOR.white} />
                    </TouchableOpacity>
                }
                right={
                    <TouchableOpacity onPress={() => navigation.navigate('AccountScreen')}>
                        <UserAvatars info={user} />
                    </TouchableOpacity>
                }
            />
            <Stack>
                <Carousel
                    loop
                    style={{ borderRadius: 20 }}
                    layout={"stack"}
                    ref={e => csls = e}
                    data={[carousel]}
                    sliderWidth={LAYOUT.window.width}
                    itemWidth={LAYOUT.window.width * 0.94}
                    renderItem={_renderItem}
                    onSnapToItem={index => console.log(index)}
                />
            </Stack>
            <Stack px={3}>
                <HStack justifyContent='space-between' py={2} borderColor={COLOR.grey} borderBottomWidth={1}>
                    <Text color={COLOR.white} fontSize='sm'>{t('Assets Statement')}</Text>
                </HStack>
            </Stack>
            <FlatList
                flex={1}
                px={3}
                data={assets}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <HStack alignItems='center' justifyContent='space-between' py={3} borderBottomWidth={1} borderColor={COLOR.grey}>
                        <HStack alignItems='center'>
                            <Image source={{ uri: item?.token_url }} resizeMode='contain' size='xs' />
                            <Text color={COLOR.white} fontSize='sm' ml={3} textTransform='uppercase'>{item?.token_abbr}</Text>
                        </HStack>
                        <Stack alignItems='flex-end'>
                            <Text color={COLOR.white} fontSize='sm' textTransform='uppercase'>{item?.balance}</Text>
                            <Text color={COLOR.grey} fontSize='xs' textTransform='uppercase'>
                                {item?.token_price == 0 ? `--` : `≈ ${(item?.token_price * item?.balance).toFixed(2)} ${LAYOUT.currency}`}
                            </Text>
                        </Stack>
                    </HStack>
                )}
                refreshing={refresh}
                onRefresh={loadAssets}
                keyExtractor={(item, index) => `${index}`}
            />
            <Footers routeName={`AssetsScreen`} />
            <Modal isOpen={visibleDeposit} onClose={() => setVisibleDeposit(false)}>
                <Modal.Content bg={COLOR.primary}>
                    <Modal.CloseButton color={COLOR.white} />
                    <Modal.Header _text={{ color: COLOR.white }}>{t('Deposit')}</Modal.Header>
                    <Modal.Body pb={0}>
                        <Center mt={5}>
                            <Stack p={2} bg={COLOR.white} borderRadius={2}>
                                <QRCode
                                    value={address}
                                    size={normalize(130)}
                                    logoBackgroundColor='transparent'
                                />
                            </Stack>
                            <Text mt={5} color={COLOR.white} fontSize='sm' w='75%' textAlign='center'>{address}</Text>
                        </Center>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Group variant="link" space={2}>
                            <Button onPress={copyToClipboard}>
                                <HStack alignItems='center'>
                                    <Icon as={<Feather name='copy' />} size='xs' color={COLOR.warning} />
                                    <Text fontSize='xs' color={COLOR.warning}>{t('Copy')}</Text>
                                </HStack>
                            </Button>
                            <Button onPress={onShare}>
                                <HStack alignItems='center'>
                                    <Icon as={<Feather name='share' />} size='xs' color={COLOR.warning} />
                                    <Text fontSize='xs' color={COLOR.warning}>{t('Share')}</Text>
                                </HStack>
                            </Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
            <Modal isOpen={visibleWithdraw} onClose={() => setVisibleWithdraw(false)}>
                <Modal.Content bg={COLOR.primary}>
                    <Modal.CloseButton color={COLOR.white} />
                    <Modal.Header _text={{ color: COLOR.white }}>{t('Withdraw')}</Modal.Header>
                    <Modal.Body pb={0}>
                        <Input
                            p={1}
                            mt={2}
                            w='100%'
                            size='sm'
                            type='text'
                            variant='underlined'
                            placeholder='Address'
                            autoCapitalize={'none'}
                            value={to_address}
                            onChangeText={setAddress}
                            color={COLOR.white}
                            borderBottomColor={COLOR.inputBorberColor}
                            placeholderTextColor={COLOR.inputLabelColor}
                        />
                        <FlatList
                            mt={2}
                            maxH={normalize(170)}
                            data={assets}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) => `${index}`}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => setSelected(item)}>
                                    <HStack alignItems='center' justifyContent='space-between' py={2}>
                                        <HStack alignItems='center'>
                                            <Image source={{ uri: item?.token_url }} size={8} resizeMode='contain' />
                                            <Text textAlign='right' color={COLOR.white} ml={2} fontSize='sm' textTransform='uppercase'>{item?.token_name}</Text>
                                        </HStack>
                                        <HStack alignItems='center'>
                                            <Text textAlign='right' color={COLOR.white} fontSize='xs' bold mr={2}>{item?.balance}</Text>
                                            {
                                                selected?.token_id === item?.token_id ?
                                                    <Icon as={<MaterialIcons name='radio-button-on' />} size='xs' color={COLOR.white} /> :
                                                    <Icon as={<MaterialIcons name='radio-button-off' />} size='xs' color={COLOR.white} />
                                            }
                                        </HStack>
                                    </HStack>
                                </TouchableOpacity>
                            )}
                        />
                        {
                            Object.keys(selected).length ? (
                                <Fragment>
                                    <Text fontSize='xs' color={COLOR.white} mt={2} numberOfLines={1}>
                                        {t('available-string', { string: `${selected?.balance} ${selected?.token_abbr}` })}
                                    </Text>
                                    <Input
                                        p={1}
                                        w='100%'
                                        size='sm'
                                        type='text'
                                        variant='underlined'
                                        keyboardType='numeric'
                                        placeholder='Amount'
                                        autoCapitalize={'none'}
                                        value={amount}
                                        onChangeText={setAmount}
                                        color={COLOR.white}
                                        borderBottomColor={COLOR.inputBorberColor}
                                        placeholderTextColor={COLOR.inputLabelColor}
                                        InputRightElement={
                                            <TouchableOpacity onPress={() => setAmount(selected?.balance)}>
                                                <Text color={COLOR.white} fontSize='xs'>{t('MAX')}</Text>
                                            </TouchableOpacity>
                                        }
                                    />
                                </Fragment>
                            ) : null
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Group variant="link" space={2}>
                            <Button onPress={Withdraw} disabled={loading}>
                                {
                                    loading ? <Spinner /> :
                                        <Text fontSize='xs' color={COLOR.warning}>{t('Withdraw')}</Text>
                                }
                            </Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </Box>
    )
}