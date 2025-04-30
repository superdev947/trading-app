import React, { useContext, useEffect } from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { MaterialCommunityIcons, Feather, AntDesign, MaterialIcons } from '@expo/vector-icons'
import { Box, Icon, List, FlatList, Text, Divider, HStack, ScrollView, Button, Stack, Center, Image, Avatar, Badge } from 'native-base'
import { COLOR, LAYOUT, LocalizationContext } from '../../../constants'
import { Footers, Headers } from '../../../components'
import { useDispatch, useSelector } from 'react-redux'
import normalize from 'react-native-normalize'
import { Logut, setUserInfo } from '../../../redux/actions/authActions'
import { useApi } from '../../../redux/services'

const DATA = [
    {
        icon: <AntDesign name='creditcard' />,
        title: 'Fund Statement',
        screen: 'FundStatementScreen',
        type: 'Item'
    },
    {
        icon: <Feather name='user' />,
        title: 'Edit Profile',
        screen: 'EditProfileScreen',
        type: 'Item'
    },
    {
        icon: <AntDesign name="idcard" />,
        title: 'ID Verification',
        screen: 'IDCardScreen',
        type: 'Item'
    },
    {
        type: 'Divider'
    },
    {
        icon: <Feather name="copy" />,
        title: 'Copy Trade Settings',
        screen: 'CopyTradeSettingsScreen',
        type: 'Item'
    },
    {
        icon: <MaterialIcons name='security' />,
        title: 'Security',
        screen: 'SecurityScreen',
        type: 'Item'
    },
    {
        icon: <Feather name='settings' />,
        title: 'Settings',
        screen: 'SettingsScreen',
        type: 'Item'
    },
    {
        icon: <AntDesign name="wechat" />,
        title: 'Support',
        screen: 'SupportScreen',
        type: 'Item'
    },
    {
        type: 'Divider'
    },
]
export default ({ navigation }) => {
    const { t } = useContext(LocalizationContext)
    const Api = useApi()
    const dispatch = useDispatch()
    const { user } = useSelector(state => state.auth)

    const onNavigation = (params) => {
        if (params.title === 'ID Verification' && (user.idverify == 'Verified' || user.idverify == 'Pending')) {

        } else {
            navigation.navigate(params.screen)
        }
    }

    const GetUserInfo = () => {
        if (user) {
            Api.GetUserInfo(user._id).then(({ data }) => {
                dispatch(setUserInfo(data))
            }).catch(error => {
                console.log(`GetUserInfo`, error)
            })
        }
    }

    const SignOut = () => {
        dispatch(Logut())
    }

    useEffect(() => {
        GetUserInfo()
    }, [])

    const Item = ({ item }) => (
        <List.Item
            onPress={() => onNavigation(item)}
            w={LAYOUT.window.width * 1}
            justifyContent='center'
        >
            {
                item.type == 'Divider' ? (
                    <Box w={LAYOUT.window.width * 0.95} h={StyleSheet.hairlineWidth} color='#abbcd2'><Divider /></Box>
                ) : (
                    <HStack justifyContent='space-between' alignItems='center' w={LAYOUT.window.width * 0.95} mt={1}>
                        <HStack justifyContent='space-between' alignItems='center'>
                            <Icon
                                as={item.icon}
                                color='#abbcd2'
                                size='sm'
                                mr={2}
                            />
                            <Text
                                fontSize='md'
                                color='#abbcd2'
                            >
                                {t(item.title)}
                            </Text>
                        </HStack>
                        <HStack>
                            {item.title === 'ID Verification' && (
                                <Badge bgColor={user.idverify ? COLOR.success : COLOR.info} borderRadius={100}>
                                    <Text fontSize='sm' color={COLOR.white} textTransform='capitalize' m={1}>
                                        {t(String(user.idverify))}
                                    </Text>
                                </Badge>
                            )}
                            <Icon
                                as={<MaterialCommunityIcons name='chevron-right' />}
                                color='#abbcd2'
                                size='sm'
                            />
                        </HStack>
                    </HStack >
                )
            }
        </List.Item >
    )

    return (
        <Box flex={1} bg={COLOR.primary} w='100%'>
            <Headers
                title={''}
                left={
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon as={<MaterialCommunityIcons name='chevron-left' />} size='sm' color={COLOR.white} />
                    </TouchableOpacity>
                }
            />
            <ScrollView flex={1} showsVerticalScrollIndicator={false}>
                <Center mt={3}>
                    {user?.avatar ?
                        <Image
                            source={{ uri: user.avatar }}
                            size={normalize(80)}
                            borderRadius={100}
                            borderWidth={1}
                            borderColor={COLOR.grey}
                        />
                        :
                        <Avatar bgColor={COLOR.chatColor} size={normalize(80)}>
                            <Text color={COLOR.white} fontSize='md'>
                                {(user.firstname.slice(0, 1) + user.lastname.slice(0, 1)).toUpperCase()}
                            </Text>
                        </Avatar>
                    }
                </Center>
                <FlatList
                    mt={2}
                    data={DATA}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => `${index}`}
                    renderItem={({ item }) => <Item item={item} />}
                />
                <Stack px={2} mt={2} mb={5}>
                    <Button borderRadius={2} bgColor={COLOR.warning} size='md' onPress={SignOut}>{t('Sign Out')}</Button>
                </Stack>
            </ScrollView>
            <Footers routeName={`AccoutScreen`} />
        </Box >
    )
}
