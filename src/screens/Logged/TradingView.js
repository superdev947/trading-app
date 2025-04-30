import React, { useContext } from 'react'
import { TouchableOpacity } from 'react-native'
import { Box, Icon, HStack, Button, Center } from 'native-base'
import WebView from 'react-native-webview'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Headers, TreadingViewItem } from '../../components'
import { COLOR, LAYOUT, LocalizationContext, ROOT } from '../../constants'

const TradingView = ({ navigation }) => {
    const { t } = useContext(LocalizationContext)
    const theme = 'dark'
    const interval = 30
    const item = navigation.state.params

    return (
        <Box flex={1} bg={COLOR.primary} w='100%'>
            <Headers
                title={t('Trading View')}
                left={
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon as={<MaterialCommunityIcons name='chevron-left' />} size='sm' color={COLOR.white} />
                    </TouchableOpacity>
                }
            />
            <TreadingViewItem data={item} />
            <WebView
                source={{ uri: `${ROOT.BACKEND_URL}tradingView?id=${item.id}&symbol=${item.symbol}&theme=${theme}&interval=${interval}` }}
                style={{ width: LAYOUT.window.width, flex: 1 }}
            />
            <Center>
                <HStack py={2} bg={COLOR.primary} space={5}>
                    <Button
                        w={'40%'}
                        size="sm"
                        colorScheme="success"
                        _text={{ color: "white" }}
                        borderRadius={3}
                        onPress={() => navigation.push('TradeScreen', { activeData: item, type: 'buy' })}
                    >
                        {t('Buy')}
                    </Button>
                    <Button
                        size="sm"
                        w={'40%'}
                        colorScheme="danger"
                        _text={{ color: "white" }}
                        borderRadius={3}
                        onPress={() => navigation.push('TradeScreen', { activeData: item, type: 'sell' })}
                    >
                        {t('Sell')}
                    </Button>
                </HStack>
            </Center>
        </Box>
    )
}

export default TradingView