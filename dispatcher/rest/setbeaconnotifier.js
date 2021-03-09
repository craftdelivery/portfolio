import axios from 'axios'
import { StatusCodes as http } from 'http-status-codes'
import to from 'await-to-js'
import urls from '../constants/urls'
import {
  setIsBeacon,
  setIsNotifier,
} from '../store/actions'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default async function setBeaconNotifier(dispatch, {
  device,
  isBeacon,
  uid,
}) {
  let newState

  if (isBeacon) {
    newState = !device.isBeacon
  } else {
    newState = !device.isNotifier
  }

  const [err, resp] = await to(
    axios({
      method: 'PUT',
      url: urls.device, 
      data: {
        did: device.id,
        isBeacon,
        newState,
        uid,
      }
    })
  )
  if (err) {
    console.log(err)
    return
  }
  if (isBeacon) {
    dispatch(setIsBeacon(newState))
  } else {
    dispatch(setIsNotifier(newState))
  }
}