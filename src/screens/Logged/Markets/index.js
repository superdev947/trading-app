import React, { useContext, useEffect, useState } from 'react'
import { BackHandler, TouchableOpacity } from 'react-native'
import { Box, Icon, HStack, Text, FlatList, Pressable } from 'native-base'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Footers, Headers, MarketsItem } from '../../../components'
import { useApi } from '../../../redux/services'
import { COLOR, LocalizationContext } from '../../../constants'

const type = [
    { title: 'ALL', value: 'ALL' },
    { title: 'TRX', value: 'TRX' },
    { title: 'USDT', value: 'USDT' }
]

const HomeScreen = ({ navigation }) => {
    const { t } = useContext(LocalizationContext)
    let timer = null
    const Api = useApi()
    const [markets, setMarkets] = useState([])
    const [loading, setLoading] = useState(false)
    const [pairType, setPairType] = useState('ALL')

    const LoadMarkets = (isLoading) => {
        if (isLoading) {
            setLoading(true)
            Api.LoadMarkets({ sortType: 1, pairType: '' }).then(({ data }) => {
                setMarkets(data.data)
                setLoading(false)
            }).catch(error => {
                setLoading(false)
                console.log(`LoadMarkets`, error)
            })
        } else {
            // console.log(`timer run`, timer)
            Api.LoadMarkets({ sortType: 1, pairType: '' }).then(({ data }) => {
                setMarkets(data.data)
            }).catch(error => {
                console.log(`LoadMarkets`, error)
            })
        }
    }

    const clear = () => {
        clearInterval(timer)
        timer = null
        console.log(`timer clear`, timer)
    }

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', clear)
        navigation.addListener('didBlur', clear)
        navigation.addListener('didFocus', () => {
            LoadMarkets(true)
            clearInterval(timer)
            timer = setInterval(LoadMarkets, 10000)
        })
    }, [navigation])

    return (
        <Box flex={1} bg={COLOR.primary} w='100%'>
            <Headers
                title={t('Markets')}
                left={
                    <TouchableOpacity onPress={navigation.openDrawer}>
                        <Icon as={<MaterialCommunityIcons name='menu' />} size='sm' color={COLOR.white} />
                    </TouchableOpacity>
                }
            />
            <HStack my={2} px={2}>
                <FlatList
                    data={type}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <Pressable alignSelf='center' px={5} py={2} mr={2} bg={COLOR.currencyColor} onPress={() => setPairType(item.value)}>
                            <Text fontSize='sm' bold color={pairType === item.value ? COLOR.white : COLOR.grey}>{item.title}</Text>
                        </Pressable>
                    )}
                    keyExtractor={(item, index) => `${index}`}
                />
            </HStack>
            <FlatList
                px={2}
                refreshing={loading}
                onRefresh={() => LoadMarkets(true)}
                data={markets}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => <MarketsItem data={item} active={pairType} />}
                keyExtractor={(item, index) => `${index}`}
            />
            <Footers routeName={`MarketsScreen`} />
        </Box>
    )
}

export default HomeScreen