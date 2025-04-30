import React, { useContext, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { ScrollView, Box, Center, Image, Input, Icon, Text, useToast, HStack, Spinner } from 'native-base'
import { FontAwesome, AntDesign } from '@expo/vector-icons'
import { COLOR, Images, LocalizationContext } from '../../constants'
import { useApi } from '../../redux/services'

const ResetPasswordScreen = ({ navigation }) => {
    const { t } = useContext(LocalizationContext)
    const Api = useApi()
    const Toast = useToast()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSignIn = () => {
        if (email == '') {
            return Toast.show({ title: t('msg-0'), placement: 'bottom', status: 'error' })
        }
        setLoading(true)
        Api.ResetPassword({
            email
        }).then(({ data }) => {
            console.log(data)
            setLoading(false)
        }).catch(error => {
            setLoading(false)
            if (error.response && error.response.status === 400) {
                return Toast.show({ title: error.response.data, placement: 'bottom', status: 'error' })
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
                    <Image size='lg' alignSelf='center' alt='Logo' my={5} source={Images.Logos} />
                    <Text fontSize='xl' w='100%' bold mt={10} color={COLOR.white}>{t('Reset your password')}</Text>
                    <Text fontSize='xs' w='100%' mt={5} color={COLOR.white}>{t('Reset-password')}</Text>
                    <Input
                        p={1}
                        mt={10}
                        w='100%'
                        size='sm'
                        type='text'
                        variant='underlined'
                        placeholder={t('EMAIL')}
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
                    <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={handleSignIn} disabled={loading}>
                        <Box
                            bg={{
                                linearGradient: {
                                    colors: COLOR.buttonGColor,
                                },
                            }}
                            px={5}
                            py={2}
                            my={7}
                            borderRadius={5}
                            flexDirection='row'
                            alignItems='center'
                        >
                            <Text fontSize='sm' bold color={COLOR.white}>{t('Reset Password')}</Text>
                            {
                                loading ?
                                    <Spinner size="sm" ml={1} color={COLOR.white} /> :
                                    <Icon as={<AntDesign name='arrowright' />} ml={1} size='xs' color={COLOR.white} />
                            }
                        </Box>
                    </TouchableOpacity>
                    <HStack space={3} mt={10} alignItems='center'>
                        <Text fontSize='xs' color={COLOR.grey}>{t('Have an account?')}</Text>
                        <TouchableOpacity onPress={() => navigation.push('SignInScreen')}>
                            <Text bold fontSize='xs' color={COLOR.textColor2}>{t('Sign in')}</Text>
                        </TouchableOpacity>
                    </HStack>
                </Center>
            </ScrollView>
        </Box>
    )
}

export default ResetPasswordScreen