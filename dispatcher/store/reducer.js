import {
  configureStore,
  createSlice,
} from '@reduxjs/toolkit'
import {
  combineReducers,
} from 'redux'
import deviceSlice from './deviceslice'
import locSlice from './locslice'
import userSlice from './userslice'

// action names should be unique
// because we want to export all from here...

const reducer = combineReducers({
  device: deviceSlice.reducer,
  loc: locSlice.reducer,
  user: userSlice.reducer,
})

const store = configureStore({
  reducer,
  devTools: true,
})
export default store