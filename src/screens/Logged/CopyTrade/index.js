import React, { useContext, useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { Box, Stack, Icon, FlatList, HStack, Text, Badge, Button, VStack } from 'native-base'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Footers, Headers, UserAvatars } from '../../../components'
import { COLOR, LocalizationContext } from '../../../constants'
import { useApi } from '../../../redux/services'
import { useSelector } from 'react-redux'

const CopyTradeScreen = ({ navigation }) => {
    const { t } = useContext(LocalizationContext)
    const { user } = useSelector(state => state.auth)
    const Api = useApi()
    const [loading, setLoading] = useState(false)
    const [trader, setTrader] = useState([])
    const [myTrader, setMyTrader] = useState([])

    const LoadTraderList = () => {
        setLoading(true)
        Api.LoadTraderList({ user_id: user._id }).then(({ data }) => {
            setLoading(false)
            setTrader(data.result)
            setMyTrader(data.mytraders)
        }).catch(error => {
            setLoading(false)
            console.log(error.message)
        })
    }

    const Unfollow = (params) => {
        Api.Unfollow(params).then(({ data }) => {
            LoadTraderList()
        }).catch(error => {
            console.log(error.message)
        })
    }

    useEffect(() => {
        LoadTraderList()
    }, [])

    return (
        <Box flex={1} bg={COLOR.primary} w='100%'>
            <Headers
                title={t('Copy Trade')}
                left={
                    <TouchableOpacity onPress={navigation.openDrawer}>
                        <Icon as={<MaterialCommunityIcons name='menu' />} size='sm' color={COLOR.white} />
                    </TouchableOpacity>
                }
            />
            <FlatList
                flex={1}
                px={3}
                data={trader}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                    const Mytrader = myTrader.find(e => e.trader == item._id)
                    return (
                        <Box
                            mt={2}
                            bg="white"
                            shadow={2}
                            rounded="lg"
                            overflow='hidden'
                        >
                            <HStack bg={COLOR.grey} px={4} py={3} alignItems='center' justifyContent='space-between'>
                                <HStack alignItems='center'>
                                    <UserAvatars info={{ email: "fairyland" }} alignSelf='center' />
                                    <Stack alignItems='flex-start' ml={2}>
                                        <Text>{item.username}</Text>
                                        <Badge variant="outline" colorScheme="danger" borderRadius={10}>
                                            <Text fontSize={10} fontWeight='400'>{item.followers}/200</Text>
                                        </Badge>
                                    </Stack>
                                </HStack>
                                {
                                    myTrader.find(e => e.trader == item._id) ? (
                                        <HStack>
                                            <Button
                                                size='xs'
                                                borderRadius={100}
                                                onPress={() => navigation.navigate("CopyTradeSettingScreen", item)}
                                            >
                                                {t('Update')}
                                            </Button>
                                            <Button
                                                ml={1}
                                                size='xs'
                                                colorScheme='danger'
                                                borderRadius={100}
                                                onPress={() => Unfollow(Mytrader._id)}
                                            >
                                                {t('Unfollow')}
                                            </Button>
                                        </HStack>
                                    ) : (
                                        <Button
                                            disabled={user.role === "trader" || user._id == item._id}
                                            size='xs'
                                            borderRadius={100}
                                            onPress={() => navigation.navigate("CopyTradeSettingScreen", item)}
                                        >
                                            {t('Follow')}
                                        </Button>
                                    )
                                }
                            </HStack>
                            <Stack p={4}>
                                {/* <HStack mb={2} justifyContent='space-between'>
                                <VStack w='33.3%' alignItems='flex-start'>
                                    <Text fontSize='sm' textAlign='left' fontWeight='700'>5848.05%</Text>
                                    <Text fontSize='xs' textAlign='left' color={COLOR.grey}>{t('P/L Ratio 30D')}</Text>
                                </VStack>
                                <VStack w='33.3%' alignItems='center'>
                                    <Text fontSize='sm' textAlign='center' fontWeight='700'>82.86%</Text>
                                    <Text fontSize='xs' textAlign='center' color={COLOR.grey}>{t('Win Rate 30D')}</Text>
                                </VStack>
                                <VStack w='33.3%' alignItems='flex-end'>
                                    <Text fontSize='sm' textAlign='right' fontWeight='700' color='success.500'>1253.24%</Text>
                                    <Text fontSize='xs' textAlign='right' color={COLOR.grey}>{t('Profit Rate')}</Text>
                                </VStack>
                            </HStack> */}
                                <HStack justifyContent='space-between'>
                                    <VStack w='33.3%' alignItems='flex-start'>
                                        <Text fontSize='sm' textAlign='left' fontWeight='700'>{item.tradedays}</Text>
                                        <Text fontSize='xs' textAlign='left' color={COLOR.grey}>{t('Trade Days')}</Text>
                                    </VStack>
                                    <VStack w='33.3%' alignItems='center'>
                                        <Text fontSize='sm' textAlign='center' fontWeight='700'>{item.totaltrades}</Text>
                                        <Text fontSize='xs' textAlign='center' color={COLOR.grey}>{t('30D Total Trades')}</Text>
                                    </VStack>
                                    <VStack w='33.3%' alignItems='flex-end'>
                                        <Text fontSize='sm' textAlign='right' fontWeight='700'>{item.accumfollowers}</Text>
                                        <Text fontSize='xs' textAlign='right' color={COLOR.grey}>{t('Accum Followers')}</Text>
                                    </VStack>
                                </HStack>
                            </Stack>
                        </Box>
                    )
                }}
                refreshing={loading}
                onRefresh={LoadTraderList}
                keyExtractor={(item, index) => `${index}`}
            />
            <Footers routeName={`CopyTradeScreen`} />
        </Box>
    )
}

export default CopyTradeScreen