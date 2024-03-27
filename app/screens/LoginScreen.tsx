import { observer } from "mobx-react-lite"
import React, { ComponentType, FC, useMemo, useRef, useState } from "react"
import { TextInput, TextStyle, ViewStyle } from "react-native"
import { Button, Icon, Screen, Text, TextField, TextFieldAccessoryProps } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"

type PageType = 'login' | 'registration';
interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  const authPasswordInput = useRef<TextInput>(null)

  const [pageType, setPageType] = useState<PageType>('login');
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)
  const {
    authenticationStore: { login, registration, authData, setAuthData, validationError, error, setError },
  } = useStores()

  async function handleAuthorization() {
    setIsSubmitted(true)
    setAttemptsCount(attemptsCount + 1)

    if (Object.values(validationError).length) return

    if (pageType === 'login') {
      await login();
    } else {
      await registration();
    }

    setIsSubmitted(false);
  }

  function changePageType() {
    const newPageType = pageType === 'login' ? 'registration' : 'login';
    setError(undefined);
    setPageType(newPageType);
  }

  const PasswordRightAccessory: ComponentType<TextFieldAccessoryProps> = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <Icon
            icon={isAuthPasswordHidden ? "view" : "hidden"}
            color={colors.palette.neutral800}
            containerStyle={props.style}
            size={20}
            onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
          />
        )
      },
    [isAuthPasswordHidden],
  )

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <Text testID="login-heading" tx={pageType === 'login' ? "loginScreen.signIn" : "loginScreen.signUp"} preset="heading" style={$signIn} />
      <Text tx={pageType === 'login' ? "loginScreen.loginEnterDetails" : "loginScreen.registrationEnterDetails"} preset="subheading" style={$enterDetails} />
      {!error && attemptsCount > 2 && <Text tx="loginScreen.hint" size="sm" weight="light" style={$hint} />}
      {error && <Text text={error} size="sm" weight="light" style={$hint} />}

      <TextField
        value={authData.email}
        onChangeText={text => setAuthData({...authData, email: text })}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        labelTx="loginScreen.emailFieldLabel"
        placeholderTx="loginScreen.emailFieldPlaceholder"
        helper={isSubmitted ? validationError?.email : ''}
        status={isSubmitted && validationError?.email ? 'error' : undefined}
        onSubmitEditing={() => authPasswordInput.current?.focus()}
      />

      <TextField
        ref={authPasswordInput}
        value={authData.password}
        onChangeText={text => setAuthData({...authData, password: text })}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="password"
        autoCorrect={false}
        secureTextEntry={isAuthPasswordHidden}
        labelTx="loginScreen.passwordFieldLabel"
        placeholderTx="loginScreen.passwordFieldPlaceholder"
        helper={isSubmitted ? validationError?.password : ''}
        status={isSubmitted && validationError?.password ? 'error' : undefined}
        RightAccessory={PasswordRightAccessory}
      />

      <Button
        testID="login-button"
        tx={pageType === 'login' ? "loginScreen.tapToSignIn" : "loginScreen.tapToSignUp"}
        style={$tapButton}
        preset="reversed"
        onPress={handleAuthorization}
      />

      <Text onPress={changePageType} testID="toggle-link" tx={pageType === 'login' ? "loginScreen.signUp" : "loginScreen.signIn"} preset="default" style={$toggleLink} />
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
}

const $signIn: TextStyle = {
  marginBottom: spacing.sm,
}

const $enterDetails: TextStyle = {
  marginBottom: spacing.lg,
}

const $hint: TextStyle = {
  color: colors.tint,
  marginBottom: spacing.md,
}

const $textField: ViewStyle = {
  marginBottom: spacing.lg,
}

const $tapButton: ViewStyle = {
  marginTop: spacing.xs,
}

const $toggleLink: TextStyle = {
  marginTop: spacing.xs,
  color: colors.palette.primary400,
  textAlign: "center",
}
