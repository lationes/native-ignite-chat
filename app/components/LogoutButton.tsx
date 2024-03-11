import React from "react"
import { Text } from "app/components/Text"
import { View, ViewStyle } from "react-native"
import { useStores } from "app/models"
import { colors } from "app/theme"

const LogoutButton = () => {
  const {
    authenticationStore: { logout },
  } = useStores();

  return (
    <View style={$container}>
      <Text style={{ color: colors.palette.primary500 }} onPress={() => logout()} tx={"common.logOut"} />
    </View>
  )
}

const $container: ViewStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: 56,
}

export default LogoutButton