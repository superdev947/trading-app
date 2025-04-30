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
        LoadLanguage()
    }, [])

    return (
        <Box flex={1} bg={COLOR.primary} w='100%'>
            <Headers
                title={t('Settings')}
                left={
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon as={<MaterialCommunityIcons name='chevron-left' />} size='sm' color={COLOR.white} />
                    </TouchableOpacity>
                }
            />
            <ScrollView flex={1} showsVerticalScrollIndicator={false}>
                <Stack px={5}>
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
                </Stack>
            </ScrollView>
            <Footers routeName={`AccoutScreen`} />
        </Box >
    )
}
