import { observer } from "mobx-react-lite"
import React, { FC, useMemo, useState } from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import { Button, Screen, Text, TextField } from "app/components"
import { useStores } from "app/models"
import { colors, spacing } from "app/theme"
import { ChatTabScreenProps } from "app/navigators/ChatNavigator"
import { Select } from "app/components/Select"
import { CommonItemModel, KeyValueModel } from "app/types/common.types"

export const AdminPanel: FC<ChatTabScreenProps<"AdminPanel">> = observer(function AdminPanel(_props) {
  const {
    authenticationStore: { authenticatedUserId },
    userStore: { userSuggestions, error, setError, loading },
  } = useStores();

  const userSuggestionsProxy = userSuggestions.slice();

  const userDropdownItems = useMemo(() => {
    if (userSuggestionsProxy) {
      return userSuggestionsProxy.map(user => {
        return {
          id: user.id,
          title: user.email,
        }
      }).filter(user => user.id !== authenticatedUserId)
    }

    return null;
  }, [userSuggestionsProxy, authenticatedUserId]);

  const [userId, setUserId] = useState<number | null>(null);
  const [reason, setReason] = useState<string>('');
  const [errors, setErrors] = useState<KeyValueModel | null>(null);

  const handleSelectItem = (item: CommonItemModel) => {
    if (!item) {
      return;
    }

    const newErrors = { ...errors };

    if (newErrors.userId) {
      delete newErrors.userId;
    }

    setError(undefined);
    setErrors(newErrors);

    setUserId(Number(item.id));
  }

  const handleChangeReason = (value: string) => {
    const newErrors = { ...errors };

    if (newErrors.reason) {
      delete newErrors.reason;
    }

    setErrors(newErrors);
    setReason(value);
  }

  const handleSaveAddRequest = async () => {
    let errors = {};

    if (!userId) {
      errors = { ...errors, userId: "Please specify user you want to ban!"};
    }

    if (!reason) {
      errors = { ...errors, reason: "Please specify ban reason!"};
    }

    if (Object.values(errors).length) {
      setErrors(errors);
      return;
    }

    if (userId && reason) {
      await createAddRequest({ userId: selectedUserId, chatRoomId: selectedChatRoomId }, () => goBack());
    }
  }


  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top"]}
    >
      <View style={$heading}>
        <Text preset="heading" tx="adminPanel.title" />
      </View>
      <View style={$pageContent}>
        {error && <Text text={error} size="sm" weight="light" style={$hint} />}
        <View style={$inputContainers}>
          <Select
            labelTx={'adminPanel.userToBanSelect.label'}
            placeholderTx={'adminPanel.userToBanSelect.placeholder'}
            dataSet={userDropdownItems}
            selectItem={handleSelectItem}
            loading={loading.action === 'get' && loading.loading}
            status={errors?.userId ? 'error' : undefined}
            helper={errors?.userId ? errors?.userId : undefined}
          />
          <TextField
            value={reason}
            onChangeText={handleChangeReason}
            containerStyle={$textField}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
            keyboardType="default"
            labelTx="adminPanel.reasonTextField.title"
            placeholderTx="adminPanel.reasonTextField.placeholder"
            helper={errors?.reason || ''}
            status={errors?.reason ? 'error' : undefined}
          />
        </View>
        <View style={$buttonContainer}>
          <Button
            testID="message-editor-button"
            tx={"chatRoomScreen.chatRoomEditorPage.saveChatRoomInfoButtonTitle"}
            preset="reversed"
            onPress={handleSaveAddRequest}
          />
        </View>
      </View>
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
  gap: spacing.md,
  flexDirection: 'column',
}

const $heading: ViewStyle = {
  alignSelf: 'center',
  marginBottom: spacing.md,
}

const $pageContent: ViewStyle = {
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: spacing.md,
}

const $inputContainers: ViewStyle = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  gap: spacing.lg,
}

const $buttonContainer: ViewStyle = {
  width: '100%',
  gap: spacing.xs,
}

const $hint: TextStyle = {
  color: colors.tint,
  marginBottom: spacing.md,
}

const $textField: ViewStyle = {
  marginBottom: spacing.lg,
}

