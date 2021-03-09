import React, {
  useEffect,
} from 'react'
import {
  useDispatch,
  useSelector,
} from 'react-redux'
import { Platform } from 'react-native'
import {
  getPermissionsAsync,
  getExpoPushTokenAsync,
  requestPermissionsAsync,
  setNotificationChannelAsync,
} from 'expo-notifications'
import { setPushToken } from '../store/actions'

export default function NotificationWrapper() {
  const dispatch = useDispatch()
  useEffect(() => {
    async function getToken(){
      const { status: existingStatus } = await getPermissionsAsync()
      let finalStatus = existingStatus
      if (existingStatus !== 'granted') {
        const { status } = await requestPermissionsAsync();
        finalStatus = status
      }
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return
      }
      const token = (await getExpoPushTokenAsync()).data
      dispatch(setPushToken(token))
    }
    getToken()
  }, [
    dispatch,
  ])

  return null
}