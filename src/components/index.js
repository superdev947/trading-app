import React, { useContext } from "react"
import { View, Center, HStack, Icon, Pressable, Text, Stack, Button, Spinner, Image } from "native-base"
import { StyleSheet, TouchableOpacity } from "react-native"
import normalize from "react-native-normalize"
import { navigate } from "../redux/services"
import UserAvatar from 'react-native-user-avatar'
import { COLOR, LAYOUT, LocalizationContext, ROOT } from "../constants"

export const Headers = ({ title = "", left = null, right = null }) => {
  return (
    <HStack
      h={55}
      px={3}
      shadow={3}
      bg={COLOR.base}
      alignItems="center"
      justifyContent='space-between'
    >
      <View alignItems='flex-start' w={10}>{left}</View>
      <Text fontSize='lg' bold color={COLOR.white}>{title}</Text>
      <View alignItems='flex-end' w={10}>{right}</View>
    </HStack>
  )
}

export const Footers = ({ routeName }) => {
  const { t } = useContext(LocalizationContext)
  return (
    <HStack bg={COLOR.base} alignItems="center" safeAreaBottom shadow={3}>
      <Pressable
        py={2}
        flex={1}
        onPress={() => navigate('HomeScreen')}
        opacity={routeName === 'HomeScreen' ? 1 : 0.5}
      >
        <Center>
          <Icon mb={1} color="white" size="xs" viewBox="0 0 18 18">{LAYOUT.HomeIcon}</Icon>
          <Text textAlign='center' color="white" fontSize='xs'>{t("Home")}</Text>
        </Center>
      </Pressable>
      <Pressable
        py={2}
        flex={1}
        onPress={() => navigate('MarketsScreen')}
        opacity={routeName === 'MarketsScreen' ? 1 : 0.5}
      >
        <Center>
          <Icon mb={1} color="white" size="xs" viewBox="0 0 18 18">{LAYOUT.MarketsIcon}</Icon>
          <Text textAlign='center' color="white" fontSize='xs'>{t("Markets")}</Text>
        </Center>
      </Pressable>
      <Center pos='absolute' w='100%'>
        <TouchableOpacity>
          <Center shadow={2} borderRadius={100} w={70} h={70} marginTop={-normalize(10)} bg={COLOR.base}>
            <Icon mb={1} color="white" size="sm" viewBox="0 0 32 32">{LAYOUT.LogoIcon}</Icon>
            <Text textAlign='center' color="white" fontSize='xs'>{t("Trade")}</Text>
          </Center>
        </TouchableOpacity>
      </Center>
      <Pressable w={70} />
      <Pressable
        py={2}
        flex={1}
        onPress={() => navigate('CopyTradeScreen')}
        opacity={routeName === 'CopyTradeScreen' ? 1 : 0.5}
      >
        <Center>
          <Icon mb={1} color="white" size="xs" viewBox="0 0 18 18">{LAYOUT.CopyTradeIcon}</Icon>
          <Text textAlign='center' color="white" fontSize='xs'>{t("Copy Trade")}</Text>
        </Center>
      </Pressable>
      <Pressable
        py={2}
        flex={1}
        onPress={() => navigate('AssetsScreen')}
        opacity={routeName === 'AssetsScreen' ? 1 : 0.5}
      >
        <Center>
          <Icon mb={1} color="white" size="xs" viewBox="0 0 18 18">{LAYOUT.AssetsIcon}</Icon>
          <Text textAlign='center' color="white" fontSize='xs'>{t("Assets")}</Text>
        </Center>
      </Pressable>
    </HStack>
  )
}


export const Loading = ({ color = 'rgba(0,0,0,0.5)' }) => {
  return (
    <View style={{
      position: 'absolute',
      elevation: 10,
      width: LAYOUT.window.width,
      height: LAYOUT.window.height,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: color
    }}>
      <Spinner color="blue.500" size="lg" />
    </View>
  )
}

export const MainCurrency = ({ data = {} }) => {
  const title = `${data.fShortName} / ${data.sShortName}`
  const percentChange = parseFloat(data.gain) * 100
  const last = parseFloat(data.price / Math.pow(10, data.sPrecision)).toFixed(6)
  const isPlus = percentChange > 0
  data.symbol = `${data.fShortName}${data.sShortName}`
  return (
    <TouchableOpacity onPress={() => navigate('TradingView', data)}>
      <Stack alignItems='center'>
        <Text fontSize='sm' bold color={COLOR.white}>{title}</Text>
        <Text fontSize='sm' color={isPlus ? COLOR.info : COLOR.danger}>{last}</Text>
        <Text fontSize='xs' color={COLOR.white}>{isPlus && '+'}{percentChange.toFixed(2)}%</Text>
      </Stack>
    </TouchableOpacity>
  )
}

export const MarketsItem = ({ data = {}, active = 'all' }) => {
  const percentChange = parseFloat(data.gain) * 100
  const isPlus = percentChange > 0
  const last = parseFloat(data.price / Math.pow(10, data.sPrecision)).toFixed(6)
  const volume = `${(parseFloat(data.volume / Math.pow(10, data.fPrecision))).toFixed(2)} ${data.fShortName}`
  const title = `${data.fShortName} / ${data.sShortName}`
  data.symbol = `${data.fShortName}${data.sShortName}`
  if (data.fShortName === 'USDJ' || data.sShortName == 'USDJ')
    return <View />
  if (active === 'ALL' || active === data.sShortName) {
    return (
      <HStack py={2} justifyContent='space-between' alignItems='center' borderBottomWidth={StyleSheet.hairlineWidth} borderColor={COLOR.grey}>
        <HStack alignItems='center'>
          <Image source={{ uri: data.logo }} size='xs' resizeMode='contain' alt='' />
          <Stack ml={2}>
            <Text fontSize='sm' bold color={COLOR.white}>{title}</Text>
            <Text fontSize='xs' color={COLOR.grey}>{volume}</Text>
          </Stack>
        </HStack>
        <Text fontSize='sm' color={COLOR.white}>{last}</Text>
        <Button
          py={2}
          px={3}
          borderRadius={4}
          disabled={data.listed === 0}
          bg={isPlus ? COLOR.success : COLOR.danger}
          onPress={() => navigate('TradingView', data)}
        >
          <Text fontSize='xs' color={COLOR.white}> {isPlus && '+'}{(percentChange).toFixed(2)}% </Text>
        </Button>
      </HStack>
    )
  } else {
    return <View />
  }
}

export const TreadingViewItem = ({ data = {} }) => {
  const percentChange = parseFloat(data.gain) * 100
  const isPlus = percentChange > 0
  const last = parseFloat(data.price / Math.pow(10, data.sPrecision)).toFixed(6)
  const volume = `${(parseFloat(data.trxVolume24h / Math.pow(10, data.fPrecision))).toFixed(0)}`
  const title = `${data.fShortName} / ${data.sShortName}`
  data.symbol = `${data.fShortName}${data.sShortName}`

  return (
    <HStack justifyContent='space-between' alignItems='center' p={2}>
      <HStack alignItems='center'>
        <Image source={{ uri: data.logo }} size='xs' resizeMode='contain' alt='' />
        <Stack ml={2}>
          <HStack alignItems='center'>
            <Text fontSize='sm' bold color={COLOR.white}>{title}</Text>
            <Text fontSize='xs' color={isPlus ? COLOR.success : COLOR.danger}> {isPlus && '+'}{(percentChange).toFixed(2)}%</Text>
          </HStack>
          <Text fontSize='sm' bold mt={2} color={isPlus ? COLOR.success : COLOR.danger}>{last}  {isPlus ? '↑' : '↓'}</Text>
        </Stack>
      </HStack>
      <Stack ml={2} alignItems='flex-end'>
        <Text fontSize='xs' bold color={COLOR.grey}> 24H VOL </Text>
        <Text fontSize='xs' bold color={COLOR.grey}> H </Text>
        <Text fontSize='xs' bold color={COLOR.grey}> L </Text>
      </Stack>
      <Stack alignItems='flex-end'>
        <Text fontSize='xs' color={COLOR.grey}> {volume} </Text>
        <Text fontSize='xs' color={COLOR.grey}> {data.highestPrice24h} </Text>
        <Text fontSize='xs' color={COLOR.grey}> {data.lowestPrice24h} </Text>
      </Stack>
    </HStack>
  )
}


export const UserAvatars = ({ info = null, size = 35, alignSelf = 'flex-start' }) => {
  if (info && info.avatar) {
    return (
      <Stack alignSelf={alignSelf}>
        <UserAvatar
          size={normalize(size)}
          src={`${ROOT.IMAGE_URL}${info.avatar}`}
          bgColors={COLOR.chatColor}
        />
      </Stack>
    )
  } else if (info && info.firstname && info.lastname) {
    return (
      <Stack alignSelf={alignSelf}>
        <UserAvatar
          size={normalize(size)}
          name={(info.firstname.slice(0, 1) + info.lastname.slice(0, 1)).toUpperCase()}
          bgColors={COLOR.chatColor}
        />
      </Stack>
    )
  } else if (info && info.email) {
    return (
      <Stack alignSelf={alignSelf}>
        <UserAvatar
          size={normalize(size)}
          name={info.email.slice(0, 2).toUpperCase()}
          bgColors={COLOR.chatColor}
        />
      </Stack>
    )
  } else {
    return <View />
  }
}