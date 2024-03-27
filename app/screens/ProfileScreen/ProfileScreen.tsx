import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useMemo, useState } from "react"
import { ViewStyle } from "react-native"
import { Button, Screen, TextField } from "app/components"
import { useStores } from "app/models"
import { spacing } from "app/theme"
import { email as emailValidator } from "app/helpers/validator.helpers"
import { KeyValueModel } from "app/types/common.types"
import { UserInfoModel } from "app/types/user.types"
import { ChatTabScreenProps } from "app/navigators/ChatNavigator"
import AvatarEditor from "app/screens/ProfileScreen/components/AvatarEditor"
import ImageEditorModal from "app/components/ImageEditorModal"
import ConfirmationModal from "app/components/ConfirmationModal"
import * as ImagePicker from "expo-image-picker"
import { convertFileNameToLink } from "app/helpers/common.helpers"

export const ProfileScreen: FC<ChatTabScreenProps<"Profile">> = observer(function ProfileScreen(_props) {
  const {
    authenticationStore: { authenticatedUserId },
    userStore: { users, updateUser, changeAvatar, removeAvatar },
  } = useStores();

  const usersProxy = users.slice();

  const authenticatedUser = useMemo(() => {
    if (authenticatedUserId && usersProxy?.length) {
      return usersProxy.find(user => user.id === authenticatedUserId)
    }

    return null;
  }, [authenticatedUserId, usersProxy])

  const [userInfo, setUserInfo] = useState<UserInfoModel>({} as UserInfoModel);
  const [errors, setErrors] = useState<KeyValueModel | null>(null);
  const [isAvatarEditorModalOpen, setIsAvatarEditorModalOpen] = useState<boolean>(false);
  const [isAvatarDeleteModalOpen, setIsAvatarDeleteModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (authenticatedUser) {
      setUserInfo({
        email: authenticatedUser.email,
      })
    }
  }, [authenticatedUser]);

  async function handleSaveUserInfo() {
    let newErrors = {};

    const { error, validate: validateEmail } = emailValidator(userInfo);
    const isEmailValid = validateEmail(userInfo.email || '');

    if (!userInfo.email) {
      newErrors = { ...errors, email: "Email can't be empty"}
    }

    if (!isEmailValid) {
      newErrors = { ...errors, email: error}
    }

    if (Object.values(newErrors)?.length) {
      setErrors(errors);
      return;
    }

    if (authenticatedUserId) {
      await updateUser(authenticatedUserId, userInfo);
    }
  }

  const handleUpdateUserFields = (value: string, field: 'email') => {
    if (errors) {
      const newErrors = { ...errors};
      delete newErrors[field];
      setErrors(newErrors);
    }

    setUserInfo({
      [field]: value,
    })
  }

  const openAvatarEditorModal = () => {
    setIsAvatarEditorModalOpen(true);
  }

  const saveAvatar = async (image: ImagePicker.ImagePickerAsset) => {
    if (authenticatedUserId) {
      await changeAvatar(authenticatedUserId, {
        image: {
          uri: image.uri,
          type: image?.mimeType || 'image/png',
          name: image.fileName || image.type?.split('/').join('.'),
        },
      });
    }
  }

  const openDeleteAvatarModal = () => {
    setIsAvatarEditorModalOpen(false);
    setIsAvatarDeleteModalOpen(true);
  }

  const deleteAvatar = async () => {
    if (authenticatedUserId) {
      await removeAvatar(authenticatedUserId);
    }
  }

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <AvatarEditor imageUrl={convertFileNameToLink(authenticatedUser?.avatar)} onButtonPress={openAvatarEditorModal} />

      <TextField
        value={userInfo.email}
        onChangeText={text => handleUpdateUserFields(text, 'email')}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        labelTx="loginScreen.emailFieldLabel"
        placeholderTx="loginScreen.emailFieldPlaceholder"
        helper={errors?.email || ''}
        status={errors?.email ? 'error' : undefined}
      />

      <Button
        testID="login-button"
        tx={"common.save"}
        style={$tapButton}
        preset="reversed"
        onPress={handleSaveUserInfo}
      />

      <ImageEditorModal
        open={isAvatarEditorModalOpen}
        setOpen={setIsAvatarEditorModalOpen}
        titleTx={"profileScreen.avatarEditorTitle"}
        saveImageCallback={saveAvatar}
        removeImageCallback={openDeleteAvatarModal}
        showRemove={!!authenticatedUser?.avatar}
      />

      <ConfirmationModal titleTx={'profileScreen.deleteAvatarConfirmationModelTitle'} open={isAvatarDeleteModalOpen} setOpen={setIsAvatarDeleteModalOpen} okCallback={deleteAvatar} />
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  paddingVertical: spacing.xxl,
  paddingHorizontal: spacing.lg,
  gap: spacing.md,
  flexDirection: 'column',
}

const $textField: ViewStyle = {
  marginBottom: spacing.lg,
}

const $tapButton: ViewStyle = {
  marginTop: spacing.xs,
}
