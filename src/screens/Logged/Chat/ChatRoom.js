import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { TouchableOpacity } from 'react-native'
import { Badge, Box, FlatList, HStack, Icon, Stack, Text } from 'native-base'
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons'
import { Headers, UserAvatars } from '../../../components'
import { COLOR, LocalizationContext } from '../../../constants'
import { useApi } from '../../../redux/services'

const ChatRoomScreen = ({ navigation }) => {
    const { t } = useContext(LocalizationContext)
    const Api = useApi()
    const { user } = useSelector(state => state.auth)
    const [loading, setLoading] = useState(false)
    const [contacts, setContacts] = useState([])
    const otc = navigation.state.params

    const LoadContacts = () => {
        setLoading(true)
        Api.LoadContacts({ otc_id: otc._id, user_id: user._id }).then(({ data }) => {
            setContacts(data)
            setLoading(false)
        }).catch(error => {
            setLoading(false)
            console.log(`LoadContacts`, error)
        })
    }

    useEffect(() => {
        LoadContacts()
    }, [navigation])

    useEffect(() => {
        navigation.addListener('didFocus', LoadContacts)
    }, [])

    return (
        <Box flex={1} bg={COLOR.primary} w='100%'>
            <Headers
                title={t('Chat Room')}
                left={
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon as={<MaterialCommunityIcons name='chevron-left' />} size='sm' color={COLOR.white} />
                    </TouchableOpacity>
                }
            />
            <FlatList
                flex={1}
                px={3}
                refreshing={loading}
                onRefresh={LoadContacts}
                data={contacts}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <HStack
                        mt={2}
                        py={3}
                        pl={3}
                        pr={5}
                        shadow={1}
                        w={'100%'}
                        borderRadius={8}
                        bg={COLOR.base}
                        alignItems='center'
                        justifyContent='space-between'
                    >
                        <HStack justifyContent='space-between' alignItems='center'>
                            <Stack>
                                <UserAvatars info={item.user} />
                            </Stack>
                            <Stack ml={2}>
                                <Text fontSize='md' color={COLOR.white}>{item.user.firstname} {item.user.lastname}</Text>
                                <Text fontSize='xs' color={COLOR.grey}>{item.user.username}</Text>
                            </Stack>
                        </HStack>
                        <TouchableOpacity onPress={() => navigation.navigate('ChatScreen', { user_id: item.user, _id: otc._id })}>
                            <Icon m={3} as={<Entypo name='chat' />} size='sm' color={COLOR.white} />
                            {item.count && <Badge colorScheme='info' position='absolute' right={0} borderRadius={100} variant='subtle'>
                                <Text fontSize='sm' color={COLOR.white}>{item.count}</Text>
                            </Badge>}
                        </TouchableOpacity>
                    </HStack>
                )}
                keyExtractor={(item, index) => `${index}`}
            />
        </Box>
    )
}

export default ChatRoomScreen