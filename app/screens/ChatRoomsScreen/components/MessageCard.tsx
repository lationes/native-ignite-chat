import { observer } from "mobx-react-lite"
import React, { useMemo } from "react"
import {
  Image,
  ImageStyle,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import { Button, Card, Text } from "app/components"
import { colors, spacing } from "app/theme"
import { useStores } from "app/models"
import { translate } from "app/i18n"
import { convertDateToAmericanFormat, convertFileNameToLink } from "app/helpers/common.helpers"

interface IProps {
  messageId: number;
  editMessage: (messageId?: number) => void;
  deleteMessage: (messageId?: number) => void;
}

export const MessageCard = observer(function MessageCard({
                                                           messageId,
                                                           editMessage,
                                                           deleteMessage,
                                                  }: IProps) {

  const {
    userStore: { users },
    authenticationStore: { authenticatedUserId, isAdmin },
    messageStore: { messages },
  } = useStores();

  const messagesProxy = messages.slice();
  const usersProxy = users.slice();

  const message = useMemo(() => {
    if (messageId && messagesProxy?.length) {
      return messagesProxy.slice().find(message => message.id === messageId);
    }

    return null;
  }, [messageId, messagesProxy])

  const author = useMemo(() => {
    if (usersProxy?.length && message?.authorId) {
      return usersProxy.slice().find(user => user.id === message.authorId);
    }

    return null;
  }, [message, usersProxy]);

  const hasAccessToEdit = useMemo(() => {
    if (authenticatedUserId && message) {
      return authenticatedUserId === message.authorId;
    }

    return false;
  }, [authenticatedUserId, message])

  const avatar = useMemo(() => {
    const imageUrl = convertFileNameToLink(author?.avatar)

    if (imageUrl) {
      return { uri: imageUrl };
    }

    return require('../../../../assets/images/profile-placeholder.png');
  }, [author])

  const hasAccessToDelete = useMemo(() => {
    if (authenticatedUserId && message) {
      return authenticatedUserId === message.authorId || isAdmin;
    }

    return false;
  }, [authenticatedUserId, message, isAdmin])

  const dateMetadata = useMemo(() => {
    if (!message) {
      return;
    }

    if (message.updatedAt) {
      return translate('common.updatedAt', { date: convertDateToAmericanFormat(message.updatedAt, 'withTime') })
    }

    return translate('common.createdAt', { date:  convertDateToAmericanFormat(message.createdAt, "withTime") })
  }, [message]);

  return (
    <Card
      style={$item}
      verticalAlignment="force-footer-bottom"
      // onPress={handlePressCard}
      HeadingComponent={
        <View style={$metadata}>
          <View style={userInfoContainer}>
            <Image
              source={avatar}
              style={$avatarImage}
            />
            <Text
              style={$metadataText}
              size="xxs"
              accessibilityLabel={author?.email}
            >
              {author?.email}
            </Text>
          </View>
          <Text
            style={$metadataText}
            size="xxs"
            accessibilityLabel={dateMetadata}
          >
            {dateMetadata}
          </Text>
        </View>
      }
      content={message?.content}
      contentStyle={$content}
      FooterComponent={
        <View style={$footer}>
          { hasAccessToEdit ? (
            <Button
              testID="message-editor-button"
              tx={"common.edit"}
              preset="default"
              onPress={() => editMessage(message?.id)}
            />
          ) : null }
          { hasAccessToDelete ? (
            <Button
              testID="message-editor-button"
              tx={"common.remove"}
              preset="dangerous"
              onPress={() => deleteMessage(message?.id)}
            />
          ) : null }
        </View>
      }
      // RightComponent={<Image source={imageUri} style={$itemThumbnail} />}
    />
  )
})

// #region Styles

const $item: ViewStyle = {
  padding: spacing.md,
  marginTop: spacing.md,
}

const $metadata: TextStyle = {
  color: colors.textDim,
  marginTop: spacing.xs,
  flexDirection: "column",
  justifyContent: 'space-between',
  gap: spacing.xs,
}

const $content: ViewStyle = {
  marginVertical: spacing.md,
}

const $footer: ViewStyle = {
  marginTop: spacing.md,
  gap: spacing.xs,
}

const $metadataText: TextStyle = {
  color: colors.textDim,
  fontSize: 12,
  marginEnd: spacing.md,
  marginBottom: spacing.xs,
}

const userInfoContainer: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: spacing.md,
}

const $avatarImage: ImageStyle = {
  borderRadius: 75,
  width: 30,
  height: 30,
  borderColor: colors.palette.secondary100,
  borderWidth: 2,
}

// #endregion