import { observer } from "mobx-react-lite"
import React, { useMemo } from "react"
import {
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import { Button, Card, Text } from "app/components"
import { colors, spacing } from "app/theme"
import { Message } from "app/models/Message"
import { useStores } from "app/models"
import { translate } from "app/i18n"

interface IProps {
  message: Message;
  editMessage: (messageId: number) => void;
  deleteMessage: (messageId: number) => void;
}

export const MessageCard = observer(function MessageCard({
                                                           message,
                                                           editMessage,
                                                           deleteMessage,
                                                  }: IProps) {

  const {
    userStore: { users },
    authenticationStore: { authenticatedUserId }
  } = useStores();

  const author = useMemo(() => {
    if (users) {
      return users.find(user => user.id === message.authorId)
    }

    return null;
  }, [users])

  const hasAccessToEdit = useMemo(() => {
    if (authenticatedUserId && message) {
      return authenticatedUserId === message.authorId;
    }

    return false;
  }, [authenticatedUserId, message])

  const dateMetadata = useMemo(() => {
    if (message.updatedAt) {
      return translate('chatRoomScreen.messageCard.updatedAt', { date: message.updatedAt})
    }

    return translate('chatRoomScreen.messageCard.createdAt', { date: message.createdAt})
  }, [message]);

  return (
    <Card
      style={$item}
      verticalAlignment="force-footer-bottom"
      // onPress={handlePressCard}
      HeadingComponent={
        <View style={$metadata}>
          <Text
            style={$metadataText}
            size="xxs"
            accessibilityLabel={author?.email}
          >
            {author?.email}
          </Text>
          <Text
            style={$metadataText}
            size="xxs"
            accessibilityLabel={dateMetadata}
          >
            {dateMetadata}
          </Text>
        </View>
      }
      content={dateMetadata}
      FooterComponent={ hasAccessToEdit ? (
        <View>
          <Button
            testID="message-editor-button"
            tx={"chatRoomScreen.messageCard.editButtonTitle"}
            style={$cardButton}
            preset="filled"
            onPress={() => editMessage(message.id)}
          />
          <Button
            testID="message-editor-button"
            tx={"chatRoomScreen.messageCard.deleteButtonTitle"}
            style={$cardButton}
            preset="filled"
            onPress={() => deleteMessage(message.id)}
          />
        </View>
      ) : undefined}
      // RightComponent={<Image source={imageUri} style={$itemThumbnail} />}
    />
  )
})

// #region Styles

const $item: ViewStyle = {
  padding: spacing.md,
  marginTop: spacing.md,
  minHeight: 120,
}

const $metadata: TextStyle = {
  color: colors.textDim,
  marginTop: spacing.xs,
  flexDirection: "row",
  justifyContent: 'space-between',
}

const $metadataText: TextStyle = {
  color: colors.textDim,
  marginEnd: spacing.md,
  marginBottom: spacing.xs,
}

const $cardButton: ViewStyle = {
  height: 32,
}
// #endregion