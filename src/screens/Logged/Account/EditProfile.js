import React, { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert, TouchableOpacity } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Box, Icon, Stack, Image, Center, useDisclose, Actionsheet, Avatar, Text, Input, Button, ScrollView, CheckIcon, Select } from 'native-base'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import normalize from 'react-native-normalize'
import { COLOR, LocalizationContext } from '../../../constants'
import { Footers, Headers } from '../../../components'
import { useApi } from '../../../redux/services'
import { setUserInfo } from '../../../redux/actions/authActions'

export default ({ navigation }) => {
    const { t, setLocale, locale } = useContext(LocalizationContext)
    const Api = useApi()
    const dispatch = useDispatch()
    const { isOpen, onOpen, onClose } = useDisclose()
    const { user } = useSelector(state => state.auth)
    const [lang, setLang] = useState([])
    const [language, setLanguage] = useState(locale)
    const [userInfo, setUserInfos] = useState(user)
    const [loading, setLoading] = useState(false)

    const pickImage = async (type) => {
        if (type === 1) {
            try {
                const result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.All,
                    allowsEditing: false,
                    aspect: [1, 1],
                })
                if (!result.cancelled) {
                    setUserInfos(Object.assign({}, userInfo, { avatar: result.uri }))
                }
            } catch (e) {
                console.log(e)
            }
        } else if (type === 0) {
            const { granted } = await Permissions.askAsync(Permissions.CAMERA)
            if (granted) {
                let result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: false,
                    aspect: [1, 1],
                    quality: 0.5
                })
                if (!result.cancelled) {
                    setUserInfos({ ...userInfo, avatar: result.uri })
                }
            } else {
                Alert.alert("you need to give up permission to work")
            }
        }
        onClose()
    }

    const GetUserInfo = () => {
        setLoading(true)
        Api.GetUserInfo(user._id).then(({ data }) => {
            setLoading(false)
            setUserInfos(data)
        }).catch(error => {
            setLoading(false)
            console.log(`GetUserInfo`, error)
        })
    }

    const UpdateUserInfo = () => {
        setLoading(true)
        Api.UpdateUserInfo(userInfo, user._id).then(({ data }) => {
            setLoading(false)
            dispatch(setUserInfo(data))
        }).catch(error => {
            setLoading(false)
            console.log(`UpdateUserInfo`, error)
        })
    }

    const onLanguageHandler = (params) => {
        setLanguage(params)
        setLocale(params)
    }

    const LoadLanguage = () => {
        Api.LoadLanguage().then(res => {
            setLang(res.data)
        })
    }

    useEffect(() => {
        GetUserInfo()
        LoadLanguage()
    }, [])

    return (
        <Box flex={1} bg={COLOR.primary} w='100%'>
            <Headers
                title={t('Edit Profile')}
                left={
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon as={<MaterialCommunityIcons name='chevron-left' />} size='sm' color={COLOR.white} />
                    </TouchableOpacity>
                }
            />
            <ScrollView flex={1} showsVerticalScrollIndicator={false}>
                <TouchableOpacity onPress={onOpen}>
                    <Center mt={3}>
                        {userInfo?.avatar ?
                            <Image
                                source={{ uri: userInfo.avatar }}
                                size={normalize(80)}
                                borderRadius={100}
                                borderWidth={1}
                                borderColor={COLOR.grey}
                            />
                            :
                            <Avatar bgColor={COLOR.chatColor} size={normalize(80)}>
                                <Text color={COLOR.white} fontSize='md'>
                                    {(userInfo.firstname.slice(0, 1) + userInfo.lastname.slice(0, 1)).toUpperCase()}
                                </Text>
                            </Avatar>
                        }
                    </Center>
                </TouchableOpacity>
                <Stack px={5}>
                    <Input
                        p={1}
                        mt={5}
                        w='100%'
                        size='sm'
                        type='text'
                        variant='underlined'
                        placeholder={t('EMAIL')}
                        autoCapitalize={'none'}
                        value={userInfo.email}
                        onChangeText={(e) => setUserInfos({ ...userInfo, email: e })}
                        color={COLOR.white}
                        borderBottomColor={COLOR.inputBorberColor}
                        placeholderTextColor={COLOR.inputLabelColor}
                    />
                    <Input
                        p={1}
                        mt={5}
                        w='100%'
                        size='sm'
                        type='text'
                        variant='underlined'
                        placeholder={t('USER NAME')}
                        autoCapitalize={'none'}
                        value={userInfo.username}
                        onChangeText={(e) => setUserInfos({ ...userInfo, username: e })}
                        color={COLOR.white}
                        borderBottomColor={COLOR.inputBorberColor}
                        placeholderTextColor={COLOR.inputLabelColor}
                    />
                    <Input
                        p={1}
                        mt={5}
                        w='100%'
                        size='sm'
                        type='text'
                        variant='underlined'
                        placeholder={t('FIRST NAME')}
                        autoCapitalize={'none'}
                        value={userInfo?.firstname}
                        onChangeText={(e) => setUserInfos({ ...userInfo, firstname: e })}
                        color={COLOR.white}
                        borderBottomColor={COLOR.inputBorberColor}
                        placeholderTextColor={COLOR.inputLabelColor}
                    />
                    <Input
                        p={1}
                        mt={5}
                        w='100%'
                        size='sm'
                        type='text'
                        variant='underlined'
                        placeholder={t('LAST NAME')}
                        autoCapitalize={'none'}
                        value={userInfo?.lastname}
                        onChangeText={(e) => setUserInfos({ ...userInfo, lastname: e })}
                        color={COLOR.white}
                        borderBottomColor={COLOR.inputBorberColor}
                        placeholderTextColor={COLOR.inputLabelColor}
                    />
                    <Select
                        p={1}
                        mt={5}
                        w='100%'
                        size='sm'
                        borderRadius={0}
                        variant='underlined'
                        accessibilityLabel={t('Select Language')}
                        placeholder={t('Select Language')}
                        borderBottomColor={COLOR.inputBorberColor}
                        selectedValue={language}
                        onValueChange={onLanguageHandler}
                        dropdownIcon={
                            <Icon as={<MaterialCommunityIcons name='chevron-down' />} size='sm' color={COLOR.white} />
                        }
                        _selectedItem={{
                            bg: 'cyan.600',
                            endIcon: <CheckIcon size={4} />,
                        }}
                    >
                        {
                            lang.map((item, key) => <Select.Item key={key} label={item.label} value={item.value} />)
                        }
                    </Select>
                    <Button onPress={UpdateUserInfo} my={5}>
                        <Text color={COLOR.white} fontSize='sm'>{t('Submit')}</Text>
                    </Button>
                </Stack>
            </ScrollView>
            <Footers routeName={`AccoutScreen`} />
            <Actionsheet isOpen={isOpen} onClose={onClose}>
                <Actionsheet.Content>
                    <Actionsheet.Item onPress={() => pickImage(0)}>{t('Camera')}</Actionsheet.Item>
                    <Actionsheet.Item onPress={() => pickImage(1)}>{t('Library')}</Actionsheet.Item>
                </Actionsheet.Content>
            </Actionsheet>
        </Box >
    )
}
