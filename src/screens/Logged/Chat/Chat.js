import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ImageBackground, TouchableOpacity } from 'react-native'
import { Box, FlatList, Icon, HStack, Input, Text, Stack } from 'native-base'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import normalize from 'react-native-normalize'
import io from 'socket.io-client'
import { COLOR, Images, LAYOUT, LocalizationContext, ROOT } from '../../../constants'
import { Headers, UserAvatars } from '../../../components'

export class ChatScreen extends Component {
    static contextType = LocalizationContext
    constructor(props) {
        super(props)

        this.state = {
            message: '',
            messages: [],
            otc: props.navigation.state.params,
        }
        this.flatList = null
        this.timer = null
    }

    sendMessage() {
        if (this.state.message == '')
            return
        ROOT.Socket.emit('chat message', {
            sender: this.props.user._id,
            receiver: this.state.otc.user_id._id,
            otc_id: this.state.otc._id,
            message: this.state.message
        })
    }

    componentDidMount() {
        ROOT.Socket = io.connect(ROOT.BACKEND_URL, { query: this.props.user })
        ROOT.Socket.emit('load message', {
            receiver: this.state.otc.user_id._id,
            sender: this.props.user._id,
            otc_id: this.state.otc._id,
        })

        ROOT.Socket.on('load message', (data) => {
            this.setState({ messages: data })
        })

        ROOT.Socket.on('chat message', (data) => {
            const { user } = this.props
            const { user_id, _id } = this.state.otc
            const { otc_id, sender, receiver } = data
            if (otc_id == _id) {
                if ((sender == user._id && receiver == user_id._id) || (sender == user_id._id && receiver == user._id))
                    this.setState({ messages: [...this.state.messages, data] })
                if (sender == user._id)
                    this.setState({ message: '' })
            }
        })
    }

    componentWillUnmount() {
        ROOT.Socket.off('load message')
        ROOT.Socket.off('chat message')
    }

    render() {
        return (
            <Box flex={1} bg={COLOR.primary} w='100%'>
                <Headers
                    title={this.context.t('Chat')}
                    left={
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Icon as={<MaterialCommunityIcons name='chevron-left' />} size='sm' color={COLOR.white} />
                        </TouchableOpacity>
                    }
                    right={
                        <Stack alignItems='flex-start'>
                            <UserAvatars info={this.state.otc.user_id} />
                        </Stack>
                    }
                />
                <FlatList
                    flex={1}
                    px={4}
                    data={this.state.messages}
                    showsVerticalScrollIndicator={false}
                    ref={ref => this.flatList = ref}
                    onContentSizeChange={() => this.flatList.scrollToEnd()}
                    renderItem={({ item }) => (
                        item.sender == this.props.user._id ?
                            <HStack justifyContent='flex-end' my={1}>
                                <Text
                                    py={2}
                                    px={5}
                                    mr={2}
                                    shadow={1}
                                    fontSize={11}
                                    borderRadius={15}
                                    bg={COLOR.chatCover}
                                    color={COLOR.white}
                                    maxW={LAYOUT.window.width * 0.65}
                                >
                                    {item.message}
                                </Text>
                                <Stack alignItems='flex-start'>
                                    <UserAvatars info={this.props.user} />
                                </Stack>
                            </HStack>
                            :
                            <HStack justifyContent='flex-start' my={1}>
                                <Stack alignItems='flex-start'>
                                    <UserAvatars info={this.state.otc.user_id} />
                                </Stack>
                                <Text
                                    py={2}
                                    px={5}
                                    ml={2}
                                    shadow={1}
                                    fontSize={11}
                                    borderRadius={15}
                                    bg={COLOR.chatCover}
                                    color={COLOR.white}
                                    maxW={LAYOUT.window.width * 0.65}
                                >
                                    {item.message}
                                </Text>
                            </HStack>
                    )}
                    keyExtractor={(item, index) => `${index}`}
                />
                <Stack
                    mx={3}
                    mt={1}
                    mb={3}
                    pl={5}
                    shadow={2}
                    borderRadius={100}
                    bg={COLOR.chatCover}
                >
                    <Input
                        p={0}
                        borderRadius={100}
                        size='xs'
                        variant='solid'
                        autoCapitalize='none'
                        placeholder={this.context.t('input-message')}
                        bg={COLOR.chatCover}
                        color={COLOR.white}
                        placeholderTextColor={COLOR.white}
                        value={this.state.message}
                        onChangeText={message => this.setState({ message })}
                        InputRightElement={
                            <TouchableOpacity onPress={() => this.sendMessage()}>
                                <ImageBackground source={Images.Button} style={{ height: normalize(45), width: normalize(80), resizeMode: 'contain', justifyContent: 'center' }}>
                                    <Icon alignSelf='center' ml={4} as={<MaterialIcons name='send' />} size='sm' color={COLOR.white} />
                                </ImageBackground>
                            </TouchableOpacity>
                        }
                    />
                </Stack>
            </Box>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.auth.user
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen)
