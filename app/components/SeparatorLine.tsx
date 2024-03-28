import React from "react"
import { View, ViewStyle } from "react-native"
import { colors } from "app/theme"

const SeparatorLine = () => {
  return (
    <View style={$line} />
  )
}

const $line: ViewStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: 1,
  backgroundColor: colors.palette.neutral300,
}

export default SeparatorLine;