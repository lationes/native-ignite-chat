import { observer } from "mobx-react-lite"
import React, { useMemo } from "react"
import {
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import { Button, Card, Text } from "app/components"
import { colors, spacing } from "app/theme"
import { useStores } from "app/models"
import { translate } from "app/i18n"
import { convertDateToAmericanFormat } from "app/helpers/common.helpers"

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
    authenticationStore: { authenticatedUserId },
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
      content={message?.content}
      contentStyle={$content}
      FooterComponent={ hasAccessToEdit ? (
        <View style={$footer}>
          <Button
            testID="message-editor-button"
            tx={"common.edit"}
            style={$cardButton}
            preset="default"
            onPress={() => editMessage(message?.id)}
          />
          <Button
            testID="message-editor-button"
            tx={"common.remove"}
            style={$cardButton}
            preset="dangerous"
            onPress={() => deleteMessage(message?.id)}
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

const $content: ViewStyle = {
  marginVertical: spacing.md,
}

const $footer: ViewStyle = {
  marginTop: spacing.md,
  gap: spacing.xs,
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