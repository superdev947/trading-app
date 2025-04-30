import React, { useContext } from 'react'
import { useDispatch } from 'react-redux'
import { TouchableOpacity } from 'react-native'
import { Icon, ScrollView, Text, Image, Box, HStack, Stack } from 'native-base'
import { Ionicons } from '@expo/vector-icons'
import { COLOR, Images, Profile, LocalizationContext } from '../constants'
import { Logut } from '../redux/actions/authActions'
import { navigate } from '../redux/services'

export default () => {
  const { t } = useContext(LocalizationContext)
  const dispatch = useDispatch()

  const SignOut = () => {
    dispatch(Logut())
  }
  return (
    <Box flex={1} bg={COLOR.base} w='100%'>
      <Image mt={10} mb={5} source={Images.Logos} size='md' alt='logo' resizeMode='contain' alignSelf='center' />
      <Stack flex={1}>
        <ScrollView px={3} showsVerticalScrollIndicator={false}>
          {
            Profile.map((item, key) => (
              <TouchableOpacity key={key} onPress={() => navigate(item.navLink)}>
                <HStack alignItems='center' pb={4}>
                  <Icon color={COLOR.grey} viewBox="0 0 18 18" size='sm'>{item.icon}</Icon>
                  <Text color={COLOR.grey} fontSize='sm'> {t(item.title)} </Text>
                </HStack>
              </TouchableOpacity>
            ))
          }
        </ScrollView>
      </Stack>
      <TouchableOpacity onPress={SignOut}>
        <HStack p={3}>
          <Icon as={<Ionicons name='ios-power' />} size='sm' color={COLOR.grey} />
          <Text color={COLOR.grey} fontSize='sm'> {t('Sign Out')} </Text>
        </HStack>
      </TouchableOpacity>
    </Box>
  )
}