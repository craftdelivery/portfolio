import { StatusCodes as http } from 'http-status-codes'
import {
  createSlice,
} from '@reduxjs/toolkit'

const initialState = {
  loginStatus: null,
  logoutStatus: null,
  loginInProgress: false,
  logoutInProgress: false,
  logoutInProgress: false,
  details: null,
}
// perhaps we need a device slice?
// signout slice
// signin slice
// or progress slice???
// user slice just for user info
export default createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoginStatus: (s, a) => { s.loginStatus = a.payload },
    setLogoutStatus: (s, a) => { s.logoutStatus = a.payload },
    setLoginInProgress: (s, a) => { s.loginInProgress = a.payload },
    setLogoutInProgress: (s, a) => { s.logoutInProgress = a.payload }, 
    setUser: (s, a) => { s.details = a.payload },
    setLogout: (s, a) => {
      s.loginInProgress = false
      s.logoutInProgress = false
      s.loginStatus = null
      s.logoutStatus = http.OK
      s.details = null 
    }
  }
})
