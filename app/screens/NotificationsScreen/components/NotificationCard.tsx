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

interface IProps {
  addRequestId: number;
  joinChatRoom: (addRequestId?: number) => void;
  deleteAddRequest: (addRequestId?: number) => void;
}

export const NotificationCard = observer(function NotificationCard({
                                                                     addRequestId,
                                                           joinChatRoom,
                                                           deleteAddRequest,
                                                         }: IProps) {

  const {
    userStore: { users },
    addRequestStore: { addRequests },
  } = useStores();

  const usersProxy = users.slice();

  const addRequest = useMemo(() => {
    if (addRequestId && addRequests?.length) {
      return addRequests.slice().find(addRequest => addRequest.id === addRequestId)
    }

    return null;
  }, [addRequestId, addRequests])

  const author = useMemo(() => {
    if (usersProxy && addRequest) {
      return usersProxy.find(user => user.id === addRequest.authorId)
    }

    return null;
  }, [usersProxy, addRequest])

  const dateMetadata = useMemo(() => {
    if (addRequest) {
      return translate('common.createdAt', { date: addRequest.createdAt})
    }

    return '';
  }, [addRequest]);

  return (
    <Card
      style={$item}
      verticalAlignment="force-footer-bottom"
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
      contentStyle={$content}
      content={addRequest?.message || ''}
      FooterComponent={
      <View style={$footer}>
        <Button
          testID="message-editor-button"
          tx={"common.accept"}
          preset="filled"
          onPress={() => joinChatRoom(addRequest?.id)}
        />
        <Button
          testID="message-editor-button"
          tx={"common.remove"}
          preset="filled"
          onPress={() => deleteAddRequest(addRequest?.id)}
        />
      </View>}
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
// #endregion