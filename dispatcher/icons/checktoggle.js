import React from 'react'
import { Ionicons } from '@expo/vector-icons'

const CHECKED_ICON = 'checkmark-circle-outline'
const UNCHECKED_ICON = 'close-circle-outline'

export default function CheckToggleIcon({
  openCol='green',
  closedCol='red',
  useCloseIcon=true,
  checked=false,
}) {


  let icon
  if (checked) {
    icon = CHECKED_ICON
    color = openCol
  } else {
    icon = useCloseIcon ? UNCHECKED_ICON : CHECKED_ICON
    color = closedCol
  }
  return (
    <Ionicons
      size={30}
      style={{ marginBottom: -3 }}
      color={color}
      name={icon}
    />
  )
}