import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ImageBackground, TouchableOpacity } from 'react-native'
import { Box, FlatList, Icon, HStack, Input, Text, Stack } from 'native-base'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import normalize from 'react-native-normalize'
import { COLOR, Images, LAYOUT, LocalizationContext, ROOT } from '../../../constants'
import { Headers, UserAvatars } from '../../../components'
import { useApi } from '../../../redux/services'

export class SupportScreen extends Component {
    static contextType = LocalizationContext
    constructor(props) {
        super(props)
        this.state = {
            support: {},
            message: '',
            messages: [],
        }
        this.flatList = null
        this.timer = null
    }

    sendMessage() {
        if (this.state.message.length) {
            const message = {
                sender: this.props.user?._id,
                receiver: this.state.support?._id,
                message: this.state.message
            }
            this.setState({ message: '' })
            ROOT.Socket.emit('support message', message)
        }

    }

    componentDidMount() {
        useApi().GetSupport().then(({ data }) => {
            this.setState({ support: data })
            useApi().GetMessage(data._id, this.props.user._id).then(res => {
                this.setState({ messages: res.data })
            })
        })
        if (ROOT.Socket && this.state.support) {
            ROOT.Socket.on('support message', (data) => {
                const { sender, receiver } = data
                const support = this.state.support?._id
                const user = this.props.user?._id
                if ((sender === user && receiver === support) || (sender === support && receiver === user)) {
                    this.setState({ messages: [...this.state.messages, data] })
                }
            })
        }
    }

    componentWillUnmount() {
        ROOT.Socket.off('support message')
    }

    render() {
        return (
            <Box flex={1} bg={COLOR.primary} w='100%'>
                <Headers
                    title={this.context.t('Support')}
                    left={
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                            <Icon as={<MaterialCommunityIcons name='chevron-left' />} size='sm' color={COLOR.white} />
                        </TouchableOpacity>
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
                                    <UserAvatars info={this.state.support} />
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

export default connect(mapStateToProps, mapDispatchToProps)(SupportScreen)
