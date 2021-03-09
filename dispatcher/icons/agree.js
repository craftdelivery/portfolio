import React from 'react'
import { Ionicons } from '@expo/vector-icons'

export default function AgreeIcon({
  color='green',
}) {
  return (
    <Ionicons
      size={30}
      style={{ marginBottom: -3 }}
      color={color}
      name='checkmark-circle-outline'
    />
  )
}