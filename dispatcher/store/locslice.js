import {
  createSlice,
} from '@reduxjs/toolkit'

export default createSlice({
  name: 'loc',
  initialState: {
    locs: [],
    gotInitPositions: false,
    gotPrevPositions: false,
    gotWatchPositionAt: null,
    gotWatchPositionTime: null,
    watchPosCount: 0,
  },
  reducers: {
    setGotInit: (s, a) => {
      s.gotInitPositions = a.payload
    },
    setGotPrev: (s, a) => {
      s.gotPrevPositions = a.payload
    },
    setGotWatchAt: (s, a) => {
      s.gotWatchPositionAt = Date.now()
      s.gotWatchPositionTime = new Date().toLocaleTimeString()
      s.watchPosCount += 1
    },
    setLoc: (s, a) => {
      s.locs = [...a.payload, ...s.locs]
    },
    clearLoc: () => null,
  }
})
