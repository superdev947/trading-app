import React, { useContext, useState } from 'react'
import { useDispatch } from 'react-redux'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { ScrollView, Box, Center, Icon, Text, useToast, Spinner, View, Stack } from 'native-base'
import { AntDesign } from '@expo/vector-icons'
import QRCode from 'react-native-qrcode-svg'
import { setAddress, setUserInfo } from '../../redux/actions/authActions'
import { COLOR, LAYOUT, LocalizationContext } from '../../constants'
import { useApi } from '../../redux/services'
import { CodeField, Cursor } from 'react-native-confirmation-code-field'

const CELL_COUNT = 6
const TwoStepVerifyScreen = ({ navigation }) => {
    const { t } = useContext(LocalizationContext)
    const Api = useApi()
    const Toast = useToast()
    const dispatch = useDispatch()
    const [code, setCode] = useState('')
    const [loading, setLoading] = useState(false)
    const params = navigation.state.params

    const handleVerify = () => {
        if (code == '') {
            return Toast.show({ title: t('msg-14'), placement: 'bottom', status: 'error' })
        }
        setLoading(true)
        Api.Confirm({ code, user_id: params.user._id }).then(({ data }) => {
            setLoading(false)
            if (data) {
                dispatch(setUserInfo(params.user))
                dispatch(setAddress(params.address))
            } else {
                return Toast.show({ title: t('msg-16'), placement: 'bottom', status: 'error' })
            }
        }).catch(error => {
            setLoading(false)
            if (error.response && error.response.status === 400) {
                return Toast.show({ title: t(error.response.data), placement: 'bottom', status: 'error' })
            } else {
                console.log(`SignIn =>`, error)
            }
        })
    }

    return (
        <Box
            flex={1}
            bg={{ linearGradient: { colors: COLOR.linearGradientColor } }}
        >
            <ScrollView showsVerticalScrollIndicator={false}>
                <Center px={5} py={10}>
                    <Center mt={10} bgColor={COLOR.white} p={3} borderRadius={10}>
                        <QRCode
                            value={`otpauth://totp/Trading?secret=${params.user.verifycode}`}
                            size={LAYOUT.window.width * .4}
                            logoBackgroundColor='transparent'
                        />
                    </Center>
                    <Text fontSize='xl' w='100%' bold mt={5} color={COLOR.white}>{t('Google verification code')}</Text>
                    <Text fontSize='sm' w='100%' mt={3} color={COLOR.white}>{t('msg-15')}</Text>
                    <Stack mt={6} px={2}>
                        <CodeField
                            value={code}
                            onChangeText={setCode}
                            cellCount={CELL_COUNT}
                            rootStyle={styles.codeFiledRoot}
                            keyboardType="number-pad"
                            renderCell={({ index, symbol, isFocused }) => (
                                <View
                                    key={index}
                                    style={[styles.cellRoot, isFocused && styles.focusCell]}>
                                    <Text
                                        style={[styles.cellText, { color: COLOR.black }]}>
                                        {symbol || (isFocused ? <Cursor /> : null)}
                                    </Text>
                                </View>
                            )}
                        />
                    </Stack>
                    <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={handleVerify} disabled={loading}>
                        <Box
                            bg={{
                                linearGradient: {
                                    colors: COLOR.buttonGColor,
                                },
                            }}
                            px={5}
                            py={2}
                            mt={10}
                            borderRadius={5}
                            flexDirection='row'
                            alignItems='center'
                        >
                            <Text fontSize='sm' bold color={COLOR.white}>{t('Verify')}</Text>
                            {
                                loading ?
                                    <Spinner size="sm" ml={1} color={COLOR.white} /> :
                                    <Icon as={<AntDesign name='arrowright' />} ml={1} size='xs' color={COLOR.white} />
                            }
                        </Box>
                    </TouchableOpacity>
                </Center>
            </ScrollView>
        </Box>
    )
}

export default TwoStepVerifyScreen

const styles = StyleSheet.create({
    codeFiledRoot: {
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    cellRoot: {
        width: 45,
        height: 45,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowColor: COLOR.grey,
        elevation: 4,
    },
    cellText: {
        color: 'black',
        fontSize: 16,
        textAlign: 'center',
    },
    focusCell: {
        borderBottomColor: 'black',
        borderBottomWidth: 0,
    },
    resentText: {
        fontSize: 16,
        fontWeight: '400',
        textAlign: 'center',
    },
    timeText: {
        fontSize: 16,
        fontWeight: '400',
        textAlign: 'center',
    },
})