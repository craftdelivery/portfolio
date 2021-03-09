import {
  createSlice,
} from '@reduxjs/toolkit'

const initialState = {
  info: null,
  fingerprint: null,
  id: null,
  isBeacon: false,
  isNotifier: false,
  name: null,
  pushToken: null,
}

export default createSlice({
  name: 'device',
  initialState,
  reducers: {
    // response from express.registerdevice
    registerDevice: (s, a) => {
      s.isBeacon = a.payload.beacon
      s.isNotifier = a.payload.notifier
      s.id = a.payload.deviceId
    },
    // from Expo.Device
    setDevice: (s, a) => {
      s.info = a.payload.info
      s.fingerprint = a.payload.fingerprint
      s.name = a.payload.name
    },
    setDeviceId: (s, a) => { s.id = a.payload },
    setIsBeacon: (s, a) => { s.isBeacon = a.payload },
    setIsNotifier: (s, a) => { s.isNotifier = a.payload },
    setPushToken: (s, a) => { s.pushToken = a.payload },
    clearDevice: (s) => { s = initialState },
  }
})
