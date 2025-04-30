import React, { Fragment, useContext, useState } from 'react'
import { useSelector } from 'react-redux'
import { Alert, TouchableOpacity } from 'react-native'
import StepIndicator from 'react-native-step-indicator'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Box, Icon, Input, Stack, ScrollView, Text, useDisclose, Select, CheckIcon, HStack, Image, Button, Actionsheet, Center, Spinner, useToast } from 'native-base'
import CountryPicker, { DARK_THEME } from 'react-native-country-picker-modal'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import { COLOR, Images, LAYOUT, LocalizationContext } from '../../../constants'
import { Headers } from '../../../components'
import normalize from 'react-native-normalize'
import moment from 'moment'
import { useApi } from '../../../redux/services'

const IDCardScreen = ({ navigation }) => {
    const { t } = useContext(LocalizationContext)
    const { user } = useSelector(state => state.auth)
    const Toast = useToast()
    const Api = useApi()
    const { isOpen, onOpen, onClose } = useDisclose()
    const [currentPage, setCurrentPage] = useState(0)
    const [imageType, setImageType] = useState(0)

    const [name, setName] = useState('')
    const [IDNumber, setIDNumber] = useState('')
    const [IDType, setIDType] = useState('Passport')
    const [countryCode, setCountryCode] = useState('AU')
    const [country, setCountry] = useState('Australia')
    const [fImage, setFImage] = useState(null)
    const [bImage, setBImage] = useState(null)
    const [pImage, setPImage] = useState(null)
    const [loading, setLoading] = useState(false)
    const onSelect = (country) => {
        setCountry(country.name)
        setCountryCode(country.cca2)
    }

    const pickImage = async (type) => {
        onClose()
        try {
            if (type === 1) {
                const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: false,
                })
                if (!result.cancelled) {
                    setImageUrl(result)
                }
            } else if (type === 0) {
                const { granted } = await Permissions.askAsync(Permissions.CAMERA)
                if (granted) {
                    const result = await ImagePicker.launchCameraAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        allowsEditing: false,
                    })
                    if (!result.cancelled) {
                        setImageUrl(result)
                    }
                } else {
                    Alert.alert("you need to give up permission to work")
                }
            }
        } catch (error) {
            console.log(`error`, error)
        }
    }

    const setImageUrl = (result) => {
        if (imageType == 1) {
            setFImage(result)
        } else if (imageType == 2) {
            setBImage(result)
        } else if (imageType == 3) {
            setPImage(result)
        }
    }


    const getValidation1 = () => {
        if (country && name && IDNumber && IDType && countryCode && fImage) {
            if (IDType == 'Passport') {
                return false
            } else if (!bImage) {
                return true
            }
        } else {
            return true
        }
    }

    const getValidation2 = () => {
        if (pImage) {
            return false
        } else {
            return true
        }
    }

    const UploadImage = async (image, type) => {
        try {
            const formData = new FormData()
            formData.append('fImage', {
                uri: image.uri,
                type: "image/png",
                name: `${type}${new Date().valueOf()}.png`,
            })
            const { data } = await Api.FileUpload(formData)
            return data?._id
        } catch (error) {
            console.log(`UploadImage error =>`, error)
            return ''
        }
    }

    const Confirm = async () => {
        setLoading(true)
        let req = {
            user_id: user._id,
            name,
            IDNumber,
            IDType,
            countryCode,
            country,
            status: 'Pending'
        }
        const FImage = await UploadImage(fImage, `f`)
        const PImage = await UploadImage(pImage, `p`)
        req.fImage = FImage
        req.pImage = PImage
        if (IDType == "Identity Card") {
            const BImage = await UploadImage(bImage, `b`)
            req.bImage = BImage
        }
        Api.IDVerification(req).then(({ data }) => {
            setLoading(false)
            navigation.navigate('AccountScreen')
            Toast.show({ title: t('Pending'), status: "success", placement: 'bottom' })
        }).catch(error => {
            console.log(`error`, error)
            setLoading(false)
        })
    }


    return (
        <Box flex={1} bg={COLOR.primary} w='100%'>
            <Headers
                title={t('ID Verification')}
                left={
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon as={<MaterialCommunityIcons name='chevron-left' />} size='sm' color={COLOR.white} />
                    </TouchableOpacity>
                }
            />
            <Stack h={2} />
            <StepIndicator
                stepCount={2}
                customStyles={LAYOUT.customStyles}
                currentPosition={currentPage}
            />
            <ScrollView flex={1}>
                {
                    currentPage === 0 && (
                        <Stack px={3}>
                            <Stack
                                p={1}
                                mt={2}
                                borderBottomWidth={1}
                                borderBottomColor={COLOR.inputBorberColor}
                            >
                                <CountryPicker
                                    countryCode={countryCode}
                                    onSelect={onSelect}
                                    visible={false}
                                    theme={{ ...DARK_THEME, backgroundColor: COLOR.primary }}
                                    withCountryNameButton={true}
                                    withFilter
                                />
                            </Stack>
                            <Input
                                p={1}
                                mt={2}
                                w='100%'
                                size='sm'
                                type='text'
                                variant='underlined'
                                placeholder={t('Name')}
                                autoCapitalize={'none'}
                                keyboardType='default'
                                value={name}
                                onChangeText={setName}
                                color={COLOR.white}
                                borderBottomColor={COLOR.inputBorberColor}
                                placeholderTextColor={COLOR.inputLabelColor}
                            />
                            <Input
                                p={1}
                                mt={2}
                                w='100%'
                                size='sm'
                                type='number'
                                variant='underlined'
                                placeholder={t('ID Number')}
                                autoCapitalize={'none'}
                                keyboardType='number-pad'
                                value={IDNumber}
                                onChangeText={setIDNumber}
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
                                accessibilityLabel={t('ID Type')}
                                placeholder={t('ID Type')}
                                borderBottomColor={COLOR.inputBorberColor}
                                selectedValue={IDType}
                                onValueChange={setIDType}
                                dropdownIcon={<Icon as={<MaterialCommunityIcons name='chevron-down' />} size='sm' color={COLOR.white} />}
                                _selectedItem={{ bg: 'cyan.600', endIcon: <CheckIcon size={4} /> }}
                            >
                                {
                                    LAYOUT.IDType.map((item, key) => <Select.Item key={key} label={item.label} value={item.value} />)
                                }
                            </Select>
                            <Text
                                mt={2}
                                px={2}
                                color={COLOR.white}
                                fontSize='sm'
                            >
                                {t('id-1')}
                            </Text>
                            <HStack px={2} mt={2} justifyContent='space-between'>
                                <TouchableOpacity onPress={() => {
                                    onOpen(), setImageType(1)
                                }}>
                                    <Center
                                        p={1}
                                        borderRadius={2}
                                        borderWidth={2}
                                        bgColor={COLOR.grey}
                                        borderColor={COLOR.warning}
                                    >
                                        <Image
                                            w={LAYOUT.window.width * 0.4}
                                            h={LAYOUT.window.width * 0.25}
                                            resizeMode='contain'
                                            source={fImage ? fImage : Images.IDcard1}
                                        />
                                    </Center>
                                </TouchableOpacity>
                                {
                                    IDType === "Identity Card" &&
                                    <TouchableOpacity onPress={() => {
                                        onOpen(), setImageType(2)
                                    }}>
                                        <Center
                                            p={1}
                                            borderRadius={2}
                                            borderWidth={2}
                                            bgColor={COLOR.grey}
                                            borderColor={COLOR.warning}
                                        >
                                            <Image
                                                w={LAYOUT.window.width * 0.4}
                                                h={LAYOUT.window.width * 0.25}
                                                resizeMode='contain'
                                                source={bImage ? bImage : Images.IDcard2}
                                            />
                                        </Center>
                                    </TouchableOpacity>
                                }
                            </HStack>
                            <HStack mt={2} px={2}>
                                <Text color={COLOR.warning} fontSize='sm' pr={2}>*</Text>
                                <Text color={COLOR.white} fontSize='xs'>{t('id-2')}</Text>
                            </HStack>
                            <Button
                                my={2}
                                mx={2}
                                size='sm'
                                borderRadius={2}
                                bgColor={COLOR.warning}
                                disabled={getValidation1()}
                                onPress={() => setCurrentPage(1)}
                            >
                                {t('Next')}
                            </Button>
                        </Stack>
                    )
                }
                {
                    currentPage === 1 && (
                        <Stack px={3}>
                            <Text
                                mt={5}
                                px={2}
                                color={COLOR.white}
                                fontSize='md'
                                fontWeight='700'
                            >
                                {t('id-3')}
                            </Text>
                            <TouchableOpacity
                                onPress={() => { onOpen(), setImageType(3) }}
                                style={{ paddingHorizontal: normalize(10) }}
                            >
                                <Center
                                    mt={2}
                                    p={3}
                                    borderRadius={2}
                                    borderWidth={2}
                                    bgColor={COLOR.grey}
                                    borderColor={COLOR.warning}
                                >
                                    <Image
                                        w={LAYOUT.window.width * 0.8}
                                        h={LAYOUT.window.width * 0.5}
                                        resizeMode='contain'
                                        source={pImage ? pImage : Images.IDcard1}
                                    />
                                </Center>
                            </TouchableOpacity>
                            <HStack mt={2} px={2}>
                                <Text color={COLOR.warning} fontSize='sm' pr={2}>*</Text>
                                <Text color={COLOR.white} fontSize='xs'>{t('id-4', { date: moment().format('YYYY-MM-DD') })}</Text>
                            </HStack>
                            <Button
                                my={2}
                                mx={2}
                                size='sm'
                                borderRadius={2}
                                bgColor={COLOR.warning}
                                disabled={getValidation2() || loading}
                                onPress={Confirm}
                            >
                                {
                                    loading ?
                                        <Spinner size="sm" ml={1} color={COLOR.white} /> :
                                        <Text fontSize='sm' bold color={COLOR.white}>{t('Confirm')}</Text>
                                }

                            </Button>
                        </Stack>
                    )
                }
            </ScrollView>
            <Actionsheet isOpen={isOpen} onClose={onClose}>
                <Actionsheet.Content>
                    <Actionsheet.Item onPress={() => pickImage(0)}>{t('Camera')}</Actionsheet.Item>
                    <Actionsheet.Item onPress={() => pickImage(1)}>{t('Library')}</Actionsheet.Item>
                </Actionsheet.Content>
            </Actionsheet>
        </Box>
    )
}

export default IDCardScreen