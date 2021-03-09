import axios from 'axios'
import { StatusCodes as http } from 'http-status-codes'
import to from 'await-to-js'
import md5 from 'js-md5'
import jwtDecode from 'jwt-decode'
import urls from '../constants/urls'
import {
  registerDevice,
  setGotPrev,
  setLoc,
  setLoginInProgress,
  setLoginStatus,
  setUser,
} from '../store/actions'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default async function login(
  dispatch, {
    device,
    email,
    pwd,
    isPwdMd5,
  }, callback
  ) {
  let deviceInfo, uid
  // todo handle in reducer
  if (!email || !email.length) {
    console.log('invalid email')
    return null
  }
  if (!pwd || !pwd.length) {
    console.log('invalid password')
    return null
  }
  dispatch(setLoginInProgress(true))
  // console.log('logging you in...')
  const password = isPwdMd5 ? pwd : md5(pwd)
  const [err, resp] = await to(
    axios({
      method: 'POST',
      url: urls.signin, 
      data: {
        pwd: password,
        email: email.trim().toLowerCase(),
      }
    })
  )
  if (err) {
    console.log('Login Error: ' + urls.signin)
    console.log(err)
    if (err.response?.status) {
      dispatch(setLoginStatus(err.response.status))
    } else {
      dispatch(setLoginStatus(http.SERVICE_UNAVAILABLE))
    }
    dispatch(setLoginInProgress(false))

    return
  }
  // statsh email and pwd
  // if using a stashed value pass true for isPwdMd5
  try {
    const jsonValue = JSON.stringify({email, pwd: password})
    await AsyncStorage.setItem('auth', jsonValue)
  } catch (e) {
    console.log('Error stashing auth')
  }
  dispatch(setLoginStatus(resp.status))
  let userData = {}
  const { user } = resp.data

  // we want to recreate a session
  try {
    dectok = jwtDecode(user.token)
    const { exp, iat } = dectok
    userData = {
      ...user,
      token: {
        t: user.token,
        iat,
        exp,
      }
    }
  } catch (e) {
    userData = {
      ...user,
      token: {
        t: user.token,
      }
    }
  }

  dispatch(setUser(userData))
  dispatch(setLoginInProgress(false))

  // we don't want to change the server login flow
  // so put device with userid here

  if (!device) {
    console.log('Device Not Defined')
  } else {
    const [dErr, dResp] = await to(
      axios({
        method: 'POST',
        url: urls.device, 
        data: {
          device,
          uid: user.userId,
        }
      })
    )
    if (dErr) {
      console.log('Error Registering device: ' + device.name)
      console.log(dErr)
    }
    // console.log(dResp.data)
    deviceInfo = dResp.data
    dispatch(registerDevice(dResp.data))
  }
  // we should add deviceId to the url params for express.js
  // right now we filter out other devices
  const url = urls.getLocs(user.userId)
  // get previous locations here for user and deviceid
  const [lErr, lResp] = await to(
    axios({
      method: 'GET',
      url: url,
    })
  )
  if (lErr) {
    console.log('ERR: Getting Previous positions: ' + url)
    console.log(lErr)
  } else {
    dispatch(setLoc(lResp.data))
    dispatch(setGotPrev(true))
  }
  callback(dispatch, user.userId, deviceInfo)
}