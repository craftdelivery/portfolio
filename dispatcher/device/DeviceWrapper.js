import React, {
  useEffect,
} from 'react'
import {
  useDispatch,
  useSelector,
} from 'react-redux'
import md5 from 'js-md5'
import * as Device from 'expo-device'
import {
  setDevice,
} from '../store/actions'


export default function DeviceWrapper() {
  const dispatch = useDispatch()
  const device = useSelector(s => s.device)
    
  useEffect(() => {
    if (!device.info) {
      // these things should not change
      // so we can take an md5 fingerprint
      const name = Device.deviceName
  
      const info = {
        brand: Device.brand,
        designName: Device.designName,
        deviceYearClass: Device.deviceYearClass,
        isDevice: Device.isDevice,
        manufacturer: Device.manufacturer,
        modelId: Device.modelId,
        modelName: Device.modelName,
        osName: Device.osName,
        productName: Device.productName,
      }
      const fingerprint = md5(JSON.stringify(info))
      dispatch(setDevice({
        name,
        info,
        fingerprint,
      }))
    }
  }, [device])

  return null
}