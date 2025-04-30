import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { TouchableOpacity } from 'react-native'
import { Box, Button, Center, CheckIcon, FlatList, HStack, Icon, Input, Modal, Select, Spinner, Stack, Text, useToast } from 'native-base'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Headers } from '../../../components'
import { useApi } from '../../../redux/services'
import { COLOR, LAYOUT, LocalizationContext } from '../../../constants'

const MOTCScreen = ({ navigation }) => {
    const { t } = useContext(LocalizationContext)
    const Api = useApi()
    const Toast = useToast()
    const { user } = useSelector(state => state.auth)
    const [cryptoImg, setCryptoImg] = useState('')
    const [cryptoId, setCryptoId] = useState('')
    const [crypto, setCrypto] = useState('')
    const [fiat, setFiat] = useState('')
    const [total, setTotal] = useState('')
    const [minimum, setMinimum] = useState('')
    const [maximum, setMaximum] = useState('')
    const [price, setPrice] = useState('')
    const [address, setAddress] = useState('')
    const [visible, setVisible] = useState(false)

    const [otcList, setOTCList] = useState([])
    const [tokenList, setTokenList] = useState([LAYOUT.baseInfo])


    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)

    const onCrytoHandler = (active) => {
        const item = tokenList.find(e => (e.tokenId || e.contractAddress) === active)
        const tokenId = item.tokenId || item.contractAddress
        setCryptoId(tokenId)
        setCryptoImg(item.imgUrl)
        setCrypto(item.abbr)
    }

    const LoadTokenList = () => {
        Api.LoadTokenList({ start: 0, limit: 17 }).then(res => {
            if (res.data && res.data.tokens.length) {
                setTokenList([LAYOUT.baseInfo, ...res.data.tokens])
            }
        }).catch(error => {
            console.log(`LoadTokenList`, error)
        })
    }

    const LoadMyOTCList = () => {
        setRefresh(true)
        Api.LoadMyOTCList({ user_id: user._id }).then(res => {
            setOTCList(res.data)
            setRefresh(false)
        }).catch(error => {
            setRefresh(false)
            console.log(`LoadMyOTCList`, error)
        })
    }

    const CreateQuote = () => {
        if (crypto == '' || fiat == '' || total == '' || minimum == '' || maximum == '' || price == '' || address == '')
            return Toast.show({ title: 'Error', placement: 'bottom', status: 'error' })
        setLoading(true)
        const data = {
            user_id: user._id,
            crypto,
            fiat,
            total,
            minimum,
            maximum,
            price,
            img: cryptoImg,
            bankAddress: address,
        }
        Api.CreateQuote(data).then(({ data }) => {
            LoadMyOTCList()
            setCryptoId('')
            setCrypto('')
            setFiat('')
            setTotal('')
            setMinimum('')
            setMaximum('')
            setPrice('')
            setAddress('')
            setLoading(false)
            setVisible(false)
            Toast.show({ title: 'Success', placement: 'bottom', status: 'success' })
        }).catch(error => {
            setLoading(false)
            console.log(`CreateQuote`, error)
        })
    }

    const DeleteQuote = (id) => {
        Api.DeleteQuote(id).then(({ data }) => {
            Toast.show({ title: 'Success', placement: 'bottom', status: 'success' })
            LoadMyOTCList()
        }).catch(error => {
            console.log(`DeleteQuote`, error)
        })
    }

    useEffect(() => {
        LoadMyOTCList()
        LoadTokenList()
    }, [navigation])

    return (
        <Box flex={1} bg={COLOR.primary} w='100%'>
            <Headers
                title={t('MY OTC')}
                left={
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon as={<MaterialCommunityIcons name='chevron-left' />} size='sm' color={COLOR.white} />
                    </TouchableOpacity>
                }
            />
            <Text px={4} pt={3} bold fontSize='xl' color={COLOR.white}>{t('List of my quote')}</Text>
            <FlatList
                px={3}
                data={otcList}
                refreshing={refresh}
                onRefresh={LoadMyOTCList}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => `${index}`}
                renderItem={({ item }) => (
                    <Stack
                        p={3}
                        mt={2}
                        borderRadius={5}
                        bg={COLOR.base}
                    >
                        <HStack alignItems='center' justifyContent='space-between'>
                            <HStack alignItems='center' space={1} mt={1}>
                                <Center w={5} h={5} bg={COLOR.danger}>
                                    <Text fontSize='md' color={COLOR.white}>S</Text>
                                </Center>
                                <Text ml={2} fontSize='md' color={COLOR.white}>{item.user_id?.username}</Text>
                            </HStack>
                            {/* <IconButton
                                onPress={() => DeleteQuote(item._id)}
                                variant="link"
                                icon={<Icon size="xs" as={<Feather name="trash-2" />} color="white" />}
                            /> */}
                        </HStack>
                        <HStack justifyContent='space-between' mt={3}>
                            <Stack>
                                <Text fontSize='xs' color={COLOR.grey}>{t('Total')}({item.crypto})</Text>
                                <Text fontSize='xs' color={COLOR.white} mt={1}>
                                    {item.total}
                                </Text>
                            </Stack>
                            <Stack>
                                <Text fontSize='xs' color={COLOR.grey}>{t('min')}</Text>
                                <Text fontSize='xs' color={COLOR.white} mt={1}>
                                    {item.minimum}
                                </Text>
                            </Stack>
                            <Stack>
                                <Text fontSize='xs' color={COLOR.grey}>{t('max')}</Text>
                                <Text fontSize='xs' color={COLOR.white} mt={1}>
                                    {item.maximum}
                                </Text>
                            </Stack>
                            <Stack>
                                <Text fontSize='xs' color={COLOR.grey}>{t('Price')}({item.fiat})</Text>
                                <Text fontSize='xs' color={COLOR.white} mt={1} textAlign='right'>
                                    {item.price}
                                </Text>
                            </Stack>
                        </HStack>
                        <Button
                            mt={2}
                            shadow={1}
                            py={1}
                            px={3}
                            borderRadius={1}
                            size='sm'
                            colorScheme='warning'
                            alignSelf='flex-end'
                            onPress={() => navigation.navigate('ChatRoomScreen', item)}
                        >
                            <Text fontSize='xs' color={COLOR.white}>{t('Do trade')}</Text>
                        </Button>
                    </Stack>
                )}
            />
            <Button
                size='md'
                colorScheme='warning'
                bg={COLOR.warning}
                borderRadius={0}
                onPress={() => setVisible(true)}
            >
                <Text fontSize='md'>{t('Create a quote')}</Text>
            </Button>
            <Modal isOpen={visible} onClose={() => setVisible(false)}>
                <Modal.Content bg={COLOR.primary}>
                    <Modal.CloseButton color={COLOR.white} />
                    <Modal.Header _text={{ color: COLOR.white }}>{t('Create quote')}</Modal.Header>
                    <Modal.Body pb={0} pl={0} ml={0}>
                        <Stack _text={{ color: COLOR.white }} m={3}>
                            <Select
                                p={1}
                                mt={2}
                                w='100%'
                                size='sm'
                                borderRadius={0}
                                variant='underlined'
                                accessibilityLabel={t('Select Coin')}
                                placeholder={t('Select Coin')}
                                borderBottomColor={COLOR.inputBorberColor}
                                selectedValue={cryptoId}
                                onValueChange={onCrytoHandler}
                                dropdownIcon={
                                    <Icon as={<MaterialCommunityIcons name='chevron-down' />} size='sm' color={COLOR.white} />
                                }
                                _selectedItem={{
                                    bg: 'cyan.600',
                                    endIcon: <CheckIcon size={4} />
                                }}
                            >
                                {tokenList.map((item, key) => (
                                    <Select.Item key={key} label={item.abbr.toUpperCase()} value={item.tokenId || item.contractAddress} />
                                ))}
                            </Select>
                            <Input
                                p={1}
                                mt={2}
                                w='100%'
                                size='sm'
                                type='text'
                                variant='underlined'
                                placeholder={t('Total coin for sell')}
                                autoCapitalize={'none'}
                                keyboardType='numeric'
                                value={total}
                                onChangeText={setTotal}
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
                                placeholder={t('Minimum number for purchase')}
                                autoCapitalize={'none'}
                                keyboardType='numeric'
                                value={minimum}
                                onChangeText={setMinimum}
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
                                placeholder={t('Maximum number for purchase')}
                                autoCapitalize={'none'}
                                keyboardType='numeric'
                                value={maximum}
                                onChangeText={setMaximum}
                                color={COLOR.white}
                                borderBottomColor={COLOR.inputBorberColor}
                                placeholderTextColor={COLOR.inputLabelColor}
                            />
                            <Select
                                p={1}
                                mt={2}
                                w='100%'
                                size='sm'
                                borderRadius={0}
                                variant='underlined'
                                accessibilityLabel={t('Select Fiat')}
                                placeholder={t('Select Fiat')}
                                borderBottomColor={COLOR.inputBorberColor}
                                selectedValue={fiat}
                                onValueChange={setFiat}
                                dropdownIcon={
                                    <Icon as={<MaterialCommunityIcons name='chevron-down' />} size='sm' color={COLOR.white} />
                                }
                                _selectedItem={{
                                    bg: 'cyan.600',
                                    endIcon: <CheckIcon size={4} />,
                                }}
                            >
                                {LAYOUT.fiatOptions.map((item, key) => (
                                    <Select.Item key={key} label={item.label} value={item.value} />
                                ))}
                            </Select>
                            <Input
                                p={1}
                                mt={2}
                                w='100%'
                                size='sm'
                                type='text'
                                variant='underlined'
                                placeholder={t('Price for each coin')}
                                autoCapitalize={'none'}
                                keyboardType='numeric'
                                value={price}
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
                                placeholder={t('Bank Address')}
                                autoCapitalize={'none'}
                                keyboardType='default'
                                value={address}
                                onChangeText={setAddress}
                                color={COLOR.white}
                                borderBottomColor={COLOR.inputBorberColor}
                                placeholderTextColor={COLOR.inputLabelColor}
                            />
                        </Stack>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Group variant="outline" space={2}>
                            <Button onPress={CreateQuote} disabled={loading} shadow={1} borderRadius={3} size='sm' colorScheme='warning'>
                                {
                                    loading ? <Spinner size='sm' /> :
                                        <Text fontSize='xs' color={COLOR.warning}>{t('Finish')}</Text>
                                }
                            </Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </Box >
    )
}
export default MOTCScreen