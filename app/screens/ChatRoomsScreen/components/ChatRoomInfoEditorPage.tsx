import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useMemo, useState } from "react"
import {
  View,
  ViewStyle,
} from "react-native"
import {
  Button,
  Screen, Text, TextField,
} from "app/components"
import { useStores } from "app/models"
import { spacing } from "app/theme"
import { KeyValueModel } from "app/types/common.types"
import { JoinedChatRoom } from "app/types/chatroom.types"
import { ChatRoom } from "app/models/ChatRoom"
interface IProps {
  chatRoom: JoinedChatRoom | null,
  navigateToChatRoom: (chatRoomId: number | 'new') => void,
}


export const ChatRoomInfoEditorPage: FC<IProps> = observer(
  function ChatRoomInfoEditorPage({ chatRoom, navigateToChatRoom }) {
    const {
      chatRoomStore: { updateChatRoom, createChatRoom },
    } = useStores();

    const [chatRoomTitle, setChatRoomTitle] = useState<string>(chatRoom?.title || '');
    const [errors, setErrors] = useState<KeyValueModel | null>(null);

    const handleSetChatRoomTitle = (text: string) => {
      setErrors(null);
      setChatRoomTitle(text);
    }

    const navigateToCUChatRoom = (chatRoom?: ChatRoom) => {
      if (chatRoom) {
        navigateToChatRoom(chatRoom.id)
      }
    }

    const handleSaveChatRoomInfo = async () => {
      if (!chatRoomTitle) {
        setErrors({ title: "Chat room title can't be empty"})
        return;
      }

      if (chatRoom?.id) {
        await updateChatRoom(chatRoom.id, { title: chatRoomTitle }, navigateToCUChatRoom)
      }

      if (!chatRoom) {
        await createChatRoom({ title: chatRoomTitle }, navigateToCUChatRoom)
      }
    }

    return (
      <Screen
        preset="fixed"
        safeAreaEdges={["top"]}
        contentContainerStyle={$screenContentContainer}
      >
        <View style={$heading}>
          <Text preset="heading" tx="chatRoomScreen.chatRoomEditorPage.title" />
        </View>
        <View style={$pageContent}>
          <TextField
            autoFocus={true}
            value={chatRoomTitle}
            onChangeText={handleSetChatRoomTitle}
            containerStyle={$textField}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
            keyboardType="default"
            labelTx="chatRoomScreen.chatRoomEditorPage.chatRoomTitleLabel"
            placeholderTx="chatRoomScreen.chatRoomEditorPage.chatRoomTitleInputPlaceholder"
            helper={errors?.title ? errors.title : ''}
            status={errors?.title ? 'error' : undefined}
          />
          <Button
            testID="message-editor-button"
            tx={"chatRoomScreen.chatRoomEditorPage.saveChatRoomInfoButtonTitle"}
            style={$tapButton}
            preset="reversed"
            onPress={handleSaveChatRoomInfo}
          />
        </View>
      </Screen>
    )
  },
)

// #region Styles
const $screenContentContainer: ViewStyle = {
  flex: 1,
}

const $heading: ViewStyle = {
  marginBottom: spacing.md,
}

const $pageContent: ViewStyle = {
  display: 'flex',
  height: '100%',
  alignItems: 'center',
  gap: spacing.md,
}

const $textField: ViewStyle = {
  marginBottom: spacing.lg,
}

const $tapButton: ViewStyle = {
  marginTop: spacing.xs,
}

// #endregion