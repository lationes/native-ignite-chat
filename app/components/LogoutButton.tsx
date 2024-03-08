import React from "react"
import { Text } from "app/components/Text"
import { View, ViewStyle } from "react-native"
import { useStores } from "app/models"

const LogoutButton = () => {
  const {
    authenticationStore: { logout },
  } = useStores();

  return (
    <View style={$container}>
      <Text onPress={() => logout()} tx={"common.logOut"} />
    </View>
  )
}

const $container: ViewStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: 56,
  width: 64,
}

export default LogoutButton