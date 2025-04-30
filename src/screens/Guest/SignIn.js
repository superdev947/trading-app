import React, { useContext, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { ScrollView, Box, Center, Image, Input, Icon, Text, useToast, HStack, Spinner } from 'native-base'
import { FontAwesome, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'
import { COLOR, Images, LocalizationContext } from '../../constants'
import { useApi } from '../../redux/services'

const SignInScreen = ({ navigation }) => {
    const { t } = useContext(LocalizationContext)
    const Api = useApi()
    const Toast = useToast()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSignIn = () => {
        if (email == '') {
            return Toast.show({ title: t('msg-0'), placement: 'bottom', status: 'error' })
        }
        if (password == '') {
            return Toast.show({ title: t('msg-1'), placement: 'bottom', status: 'error' })
        }
        setLoading(true)
        Api.SignIn({
            email,
            password
        }).then(({ data }) => {
            navigation.navigate('TwoStepVerifyScreen', data)
            setLoading(false)
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
                <Center p={5}>
                    <Image size='md' alignSelf='center' alt='Logo' mt={5} source={Images.Logos} />
                    <Text fontSize='xl' w='100%' bold mt={5} color={COLOR.white}>{t('Log in to App')}</Text>
                    <Input
                        p={1}
                        mt={5}
                        w='100%'
                        size='sm'
                        type='text'
                        variant='underlined'
                        placeholder={t('EMAIL OR USERNAME')}
                        autoCapitalize={'none'}
                        value={email}
                        onChangeText={setEmail}
                        color={COLOR.white}
                        borderBottomColor={COLOR.inputBorberColor}
                        placeholderTextColor={COLOR.inputLabelColor}
                        InputLeftElement={
                            <Icon as={<FontAwesome name='envelope-o' />} mr={1} size='xs' color={COLOR.inputIconColor} />
                        }
                    />
                    <Input
                        p={1}
                        mt={5}
                        w='100%'
                        size='sm'
                        type='password'
                        variant='underlined'
                        placeholder={t('PASSWORD')}
                        autoCapitalize={'none'}
                        value={password}
                        onChangeText={setPassword}
                        color={COLOR.white}
                        borderBottomColor={COLOR.inputBorberColor}
                        placeholderTextColor={COLOR.inputLabelColor}
                        InputLeftElement={
                            <Icon as={<MaterialCommunityIcons name='lock' />} mr={1} size='xs' color={COLOR.inputIconColor} />
                        }
                    />
                    <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={handleSignIn} disabled={loading}>
                        <Box
                            bg={{
                                linearGradient: {
                                    colors: COLOR.buttonGColor,
                                },
                            }}
                            px={5}
                            py={2}
                            mt={4}
                            borderRadius={5}
                            flexDirection='row'
                            alignItems='center'
                        >
                            <Text fontSize='sm' bold color={COLOR.white}>{t('SIGN IN')}</Text>
                            {
                                loading ?
                                    <Spinner size="sm" ml={1} color={COLOR.white} /> :
                                    <Icon as={<AntDesign name='arrowright' />} ml={1} size='xs' color={COLOR.white} />
                            }
                        </Box>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.push('ResetPasswordScreen')}>
                        <Text bold mt={10} fontSize='xs' color={COLOR.textColor2}>{t('Forgot password?')}</Text>
                    </TouchableOpacity>
                    <Text mt={1} fontSize='xs' color={COLOR.grey}>{t('Or Sign in with')}</Text>
                    <HStack space={5} mt={10}>
                        <TouchableOpacity>
                            <Box
                                py={2}
                                px={10}
                                borderRadius={7}
                                bg={COLOR.primary}
                            >
                                <Image size={5} source={Images.Google} alt='icon' resizeMode='contain' />
                            </Box>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Box
                                py={2}
                                px={10}
                                borderRadius={7}
                                bg={COLOR.primary}
                            >
                                <Image size={5} source={Images.Facebook} alt='icon' resizeMode='contain' />
                            </Box>
                        </TouchableOpacity>
                    </HStack>
                    <HStack space={3} mt={10} alignItems='center'>
                        <Text fontSize='xs' color={COLOR.grey}>{t("Don't have an account?")}</Text>
                        <TouchableOpacity onPress={() => navigation.push('SignUpScreen')}>
                            <Text bold fontSize='xs' color={COLOR.textColor2}>{t('Sign up')}</Text>
                        </TouchableOpacity>
                    </HStack>
                </Center>
            </ScrollView>
        </Box>
    )
}

export default SignInScreen