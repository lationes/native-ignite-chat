import React from "react"
import { ViewStyle } from "react-native"
import { spacing } from "app/theme"
import { Text, Screen } from "app/components"
import { useStores } from "app/models"

export const BannedScreen = () => {
  const {
    authenticationStore: { banReason },
  } = useStores();

  return (
    <Screen
      preset="fixed"
      safeAreaEdges={["top", "bottom"]}
      contentContainerStyle={$contentContainer}
    >
      <Text tx={'bannedScreen.title'} preset={'heading'} />
      <Text text={banReason || ''} preset={'formHelper'} />
    </Screen>
  )
}

const $contentContainer: ViewStyle = {
  display: 'flex',
  alignItems: "center",
  justifyContent: 'center',
  gap: spacing.lg,
  flex: 1,
}