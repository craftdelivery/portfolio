import {
  getCurrentPositionAsync,
  LocationAccuracy,
  requestPermissionsAsync,
  watchPositionAsync,
} from 'expo-location'
import * as Permissions from 'expo-permissions'
import getDistance from 'geolib/es/getDistance'
import calcSpeed from '../util/calcspeed'
import putLoc from './putloc'

// called from callback passed to login
// dispatch passed into login passed thru here
// we should ask for permissions before login??
// or just do it all in this flow and see if it works
/*
{
  "deviceInfo": Object {
    "beacon": true,
    "deviceId": 1,
    "notifier": true,
    "pushToken": "ExponentPushToken......omitted",
  },
  "dispatch": true,
  "file": "locationHander",
  "uid": 1,
}

if beacon is turned off, then the user should restart the app once
todo: cancel location services 
*/
export default async function locationHandler(dispatch, uid, deviceInfo) {
  // console.log({
  //   file: 'locationHander',
  //   deviceInfo,
  //   uid,
  //   dispatch: !!dispatch,
  // })
  const {
    beacon,
    deviceId,
    notifier,
  } = deviceInfo

  // note if we turn beacon on we should call this function
  if (!beacon) {
    console.log('This device is not a location beacon')
    return null
  }

  let { status } = await requestPermissionsAsync()
  if (status !== 'granted') {
    console.log('Permission to access location was denied')
    return
  }
  let loc = await getCurrentPositionAsync({})
  const payload = {
    ...loc.coords,
    timestamp: loc.timestamp
  }
  putLoc(dispatch, payload, deviceId, uid, true)

  try {
    // watch postition
    // we may need to do this via polling if its not firing reliably
    await watchPositionAsync({
      accuracy: LocationAccuracy.Balanced,
      timeInterval: 5000,
      distanceInterval: 500,
      mayShowUserSettingsDialog: true,
    }, (watchLoc) => {
      const payload = {
        ...watchLoc.coords,
        timestamp: watchLoc.timestamp,
      }

      putLoc(dispatch, payload, deviceId, uid, false)
    })
  } catch (e) {
    console.log('ERR: watchPositionAsync')
    console.log(e)
  }

}