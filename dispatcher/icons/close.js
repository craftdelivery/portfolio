import React from 'react'
import { Ionicons } from '@expo/vector-icons'

export default function AgreeIcon({
  color='red',
}) {
  return (
    <Ionicons
      size={30}
      style={{ marginBottom: -3 }}
      color={color}
      name='close-circle-outline'
    />
  )
}