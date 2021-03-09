import axios from 'axios'
import { StatusCodes as http } from 'http-status-codes'
import to from 'await-to-js'
import md5 from 'js-md5'
import jwtDecode from 'jwt-decode'
import urls from '../constants/urls'

import {
  clearDevice,
  setLogoutInProgress,
  setLogout,
  setLogoutStatus,
} from '../store/actions'

// pass in store.user
// we should have a valid structure to conform with express.session
export default async function login(dispatch, session) {
  dispatch(setLogoutInProgress(true))

  const [err] = await to(
    axios({
      method: 'UNLINK',
      url: urls.signin,
      data: {
        session,
        isSignout: true,
      }
    })
  )
  if (err) {
    // todo signout status
    // todo signoutprogress
    console.log(err)
    if (err.response?.status) {
      dispatch(setLogoutStatus(err.response.status))
    }
    dispatch(setLogoutInProgress(false))
    return
  }
  console.log('logging you out...')
  dispatch(setLogout())
  dispatch(clearDevice())
}