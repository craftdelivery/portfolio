import deviceSlice from './deviceslice'
import locSlice from './locslice'
import userSlice from './userslice'

export const {
  clearLoc,
  setGotInit,
  setGotPrev,
  setGotWatchAt,
  setLoc,
} = locSlice.actions

export const {
  setLoginInProgress,
  setLoginStatus,
  setLogoutStatus,
  setLogoutInProgress,
  setUser,
  setLogout
} = userSlice.actions

export const {
  registerDevice,
  setDevice,
  setDeviceId,
  setIsBeacon,
  setIsNotifier,
  setPushToken,
  clearDevice,
} = deviceSlice.actions