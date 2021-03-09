import axios from 'axios'
import urls from '../constants/urls'
import calcSpeed from '../util/calcspeed'
import {
  setGotInit,
  setGotWatchAt,
  setLoc,
} from '../store/actions'

export default async function putLoc(
  dispatch,
  loc,
  deviceId,
  uid,
  init=false,
) {
  // on init we may not be moving
  if (!init) {
    const isMoving = calcSpeed(loc)
    if (!isMoving) {
      console.log('Not logging standing postion for deviceID: ' + deviceId)
      return
    }
  }
  // we should just pass in device id
  // and stash the full device response in devices
  // perhaps some of these can be fields
  try {

    // TODO: call lambda to stash in dynamodb instead of express/pg
    // TODO: socket server over lambda
    const resp = await axios({
      data: {
        deviceId,
        init,
        loc,
        uid,
      },
      method: 'PUT',
      url: urls.driverLoc,
    })
    // we probalby want to round/massage it a bit
    dispatch(setLoc(resp.data))
    if (init) {
      dispatch(setGotInit(true))
    } else {
      dispatch(setGotWatchAt())
    }

  } catch (e) {
    console.log('ERR Axios: putLoc')
    console.log(e)
  }
}
