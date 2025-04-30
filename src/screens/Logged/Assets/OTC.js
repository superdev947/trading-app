import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { TouchableOpacity } from 'react-native'
import { Box, Button, Center, FlatList, HStack, Icon, Stack, Text } from 'native-base'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Headers } from '../../../components'
import { useApi } from '../../../redux/services'
import { COLOR, LocalizationContext } from '../../../constants'

const OTCScreen = ({ navigation }) => {
    const { t } = useContext(LocalizationContext)
    const Api = useApi()
    const { user } = useSelector(state => state.auth)
    const [otcList, setOTCList] = useState([])
    const [refresh, setRefresh] = useState(false)

    const LoadOTCList = () => {
        setRefresh(true)
        Api.LoadOTCList().then(res => {
            setOTCList(res.data)
            setRefresh(false)
        }).catch(error => {
            setRefresh(false)
            console.log(`onExchange`, error)
        })
    }

    useEffect(() => {
        LoadOTCList()
    }, [navigation])
    
    return (
        <Box flex={1} bg={COLOR.primary} w='100%'>
            <Headers
                title={t('OTC')}
                left={
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon as={<MaterialCommunityIcons name='chevron-left' />} size='sm' color={COLOR.white} />
                    </TouchableOpacity>
                }
            />
            <HStack px={4} pt={3} alignItems='center' justifyContent='space-between'>
                <Text bold fontSize='xl' color={COLOR.white}>{t('List of quote')}</Text>
                {
                    user.role === 'seller' ?
                        <Button
                            shadow={1}
                            borderRadius={1}
                            size='sm'
                            variant='link'
                            colorScheme='warning'
                            onPress={() => navigation.navigate('MOTCScreen')}
                        >
                            <Text fontSize='sm' color={COLOR.warning}>{t('MY OTC')}</Text>
                        </Button>
                        : null
                }
            </HStack>
            <FlatList
                px={3}
                data={otcList}
                refreshing={refresh}
                onRefresh={LoadOTCList}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item, index) => `${index}`}
                renderItem={({ item }) => (
                    <Stack
                        p={3}
                        mt={2}
                        borderRadius={5}
                        bg={COLOR.base}
                    >
                        <HStack alignItems='center' space={1} mt={1}>
                            <Center w={5} h={5} bg={COLOR.danger}>
                                <Text fontSize='md' color={COLOR.white}>S</Text>
                            </Center>
                            <Text ml={2} fontSize='md' color={COLOR.white}>{item.user_id?.username}</Text>
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
                            disabled={user._id == item?.user_id?._id}
                            mt={2}
                            shadow={1}
                            py={1}
                            px={3}
                            borderRadius={1}
                            size='sm'
                            colorScheme='warning'
                            alignSelf='flex-end'
                            onPress={() => navigation.navigate('ChatScreen', item)}
                        >
                            <Text fontSize='xs' color={COLOR.white}>{t('Do trade')}</Text>
                        </Button>
                    </Stack>
                )}
            />
        </Box >
    )
}
export default OTCScreen