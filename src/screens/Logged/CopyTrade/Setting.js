import React, { useContext, useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { Box, Stack, Icon, HStack, Text, Badge, Button, VStack, ScrollView, Divider, Checkbox, Spinner, useToast } from 'native-base'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import InputSpinner from "react-native-input-spinner"
import normalize from 'react-native-normalize'
import { Headers, UserAvatars } from '../../../components'
import { COLOR, LAYOUT, LocalizationContext } from '../../../constants'
import { useApi } from '../../../redux/services'
import { useSelector } from 'react-redux'

const CopyTradeSettingScreen = ({ navigation }) => {
    const Api = useApi()
    const Toast = useToast()
    const { t } = useContext(LocalizationContext)
    const { user, address } = useSelector(state => state.auth)
    const params = navigation.state.params
    const [amount, setAmount] = useState(20)
    const [maxDAmount, setMaxDAmount] = useState(12000)
    const [maxPAmount, setMaxPAmount] = useState(12000)
    const [isClose, setIsClose] = useState(true)
    const [loading, setLoading] = useState(false)
    const [balance, setBalance] = useState(0)
    const buttons = [20, 50, 100, 200]

    const copyTrade = () => {
        // if (balance < amount) {
        //     return Toast.show({ title: t('msg-12'), placement: 'bottom', status: 'error' })
        // }
        if (user.idverify !== 'Verified') {
            return Toast.show({ title: t('msg-12'), placement: 'bottom', status: 'error' })
        }
        setLoading(true)
        Api.CopyTrade({
            trader: params._id,
            user: user._id,
            address: LAYOUT.USDT,
            amount: amount * Math.pow(10, 8),
            baseAmount: amount,
            margin: maxDAmount,
            position: maxPAmount,
            close: isClose
        }).then(data => {
            setLoading(false)
            Toast.show({ title: t('Success!'), placement: 'bottom', status: 'success' })
        }).catch(error => {
            setLoading(false)
            console.log(error.message)
        })
    }

    const loadAssets = () => {
        Api.LoadAccountAssets({ address: address }).then(({ data }) => {
            const usdt = data.data.find(e => e.token_id == LAYOUT.USDT)
            if (usdt) {
                setBalance(parseFloat(usdt.balance))
            } else {
                setBalance(0)
            }
        }).catch(error => {
            console.log(`LoadAccountAssets`, error)
        })
    }

    useEffect(() => {
        loadAssets()
    }, [])

    return (
        <Box flex={1} bg={COLOR.primary} w='100%'>
            <Headers
                title={t('Copy Trade Setting')}
                left={
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon as={<MaterialCommunityIcons name='chevron-left' />} size='sm' color={COLOR.white} />
                    </TouchableOpacity>
                }
            />
            <ScrollView flex={1} showsVerticalScrollIndicator={false}>
                <Box px={4}>
                    <HStack py={3} alignItems='center' justifyContent='space-between'>
                        <HStack alignItems='center'>
                            <UserAvatars info={{ email: "fairyland" }} alignSelf='center' />
                            <Stack alignItems='flex-start' ml={2}>
                                <Text fontSize='md' color={COLOR.white}>Fairyland</Text>
                                <Badge variant="outline" colorScheme="danger" borderRadius={10} _text={{ fontWeight: '400', fontSize: 10 }}>{t('Trader')}</Badge>
                            </Stack>
                        </HStack>
                        <VStack alignItems='flex-end'>
                            <Text fontSize='md' fontWeight='700' color={COLOR.white}>USDT</Text>
                            <Text fontSize='xs' color={COLOR.white}>{t("Coin")}</Text>
                        </VStack>
                    </HStack>
                    <Divider />
                    {/* <ScrollView horizontal showsHorizontalScrollIndicator={false} pt={2} contentContainerStyle={{ alignItems: 'center' }}>
                        <Text fontSize='sm' color={COLOR.white}>{t('Type')}</Text>
                        <Button size='xs' mx={2} onPress={() => alert("Fixed Count")}>{t('Fixed Count')}</Button>
                        <Button size='xs' onPress={() => alert("Fixed Ratio")}>{t('Fixed Ratio')}</Button>
                    </ScrollView> */}
                    <Stack py={3}>
                        <HStack justifyContent='space-between' alignItems='center'>
                            <HStack justifyContent='space-between' alignItems='center'>
                                <Text fontSize='sm' textAlign='left' fontWeight='700' color={COLOR.white}>{t('Amount')}</Text>
                                <Text fontSize='xs' textAlign='left' color={COLOR.grey}> (USDT)</Text>
                            </HStack>
                            <InputSpinner
                                min={20}
                                max={200}
                                step={1}
                                width={normalize(130)}
                                height={normalize(40)}
                                skin='square'
                                value={amount}
                                onChange={setAmount}
                                color={COLOR.warning}
                            />
                        </HStack>
                        <HStack justifyContent='space-between' alignItems='center' mt={3}>
                            <Text fontSize='sm' textAlign='left' fontWeight='700' color={COLOR.white}>{t('Quick Amount')}</Text>
                            {buttons.map((item, key) => (
                                <Button
                                    size='xs'
                                    px={4}
                                    key={key}
                                    onPress={() => setAmount(item)}
                                    borderRadius={1}
                                    bg={item == amount ? COLOR.warning : COLOR.grey}
                                >
                                    <Text
                                        fontSize='xs'
                                        color={item == amount ? COLOR.black : COLOR.white}
                                    >
                                        {String(item)}
                                    </Text>
                                </Button>
                            ))}
                        </HStack>
                        <Text mt={2} fontSize='xs' textAlign='left' fontWeight='700' color={COLOR.grey}>{t('msg-8')}</Text>
                        <HStack mt={3} justifyContent='space-between' alignItems='center'>
                            <HStack justifyContent='space-between' alignItems='center' w='55%'>
                                <Text fontSize='sm' textAlign='left' fontWeight='700' color={COLOR.white}>
                                    {t('Max Daily Copy Margin')}
                                    <Text fontSize='xs' textAlign='left' color={COLOR.grey}> (USDT)</Text>
                                </Text>
                            </HStack>
                            <InputSpinner
                                min={5}
                                max={12000}
                                step={5}
                                width={normalize(130)}
                                height={normalize(40)}
                                skin='square'
                                value={maxDAmount}
                                onChange={setMaxDAmount}
                                color={COLOR.warning}
                            />
                        </HStack>
                        <Text my={2} fontSize='xs' textAlign='left' fontWeight='700' color={COLOR.grey}>{t('msg-9')}</Text>
                        {/* 
                        <Divider />
                        <Text fontSize='sm' textAlign='left' fontWeight='700' color={COLOR.white}>{t('Advanced Settings')}</Text>
                        <HStack mt={3} justifyContent='space-between' alignItems='center'>
                            <HStack justifyContent='space-between' alignItems='center' w='55%'>
                                <Text fontSize='sm' textAlign='left' fontWeight='700' color={COLOR.white}>
                                    {t('MAX Position Amount')}
                                    <Text fontSize='xs' textAlign='left' color={COLOR.grey}> (USDT)</Text>
                                </Text>
                            </HStack>
                            <InputSpinner
                                min={5}
                                max={12000}
                                step={5}
                                width={normalize(130)}
                                height={normalize(40)}
                                skin='square'
                                value={maxPAmount}
                                onChange={setMaxPAmount}
                                color={COLOR.warning}
                            />
                        </HStack>
                        <Text mt={2} fontSize='xs' textAlign='left' fontWeight='700' color={COLOR.grey}>{t('msg-10')}</Text>
                        <HStack mt={3} justifyContent='space-between' alignItems='center'>
                            <Text fontSize='sm' textAlign='left' fontWeight='700' color={COLOR.white}>{t('Close orders with the trader')}</Text>
                            <Checkbox onChange={setIsClose} isChecked={isClose} colorScheme="success" aria-label='info' />
                        </HStack>
                        <Text my={2} fontSize='xs' textAlign='left' fontWeight='700' color={COLOR.grey}>{t('msg-11')}</Text> */}
                    </Stack>
                </Box>
            </ScrollView>
            <Stack p={2}>
                <Button size='sm' disabled={loading} onPress={copyTrade}>
                    {
                        loading ?
                            <Spinner size="sm" ml={1} color={COLOR.white} /> :
                            t('Copy')
                    }
                </Button>
            </Stack>
        </Box >
    )
}

export default CopyTradeSettingScreen