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
import { ChatRoom } from "app/models/ChatRoom"
interface IProps {
  chatRoomId: number | null,
  navigateToChatRoom: (chatRoomId: number | 'new') => void,
}


export const ChatRoomInfoEditorPage: FC<IProps> = observer(
  function ChatRoomInfoEditorPage({ chatRoomId, navigateToChatRoom }) {
    const {
      chatRoomStore: { chatRooms, updateChatRoom, createChatRoom },
    } = useStores();

    const chatRoomsProxy = chatRooms.slice();

    const [chatRoomTitle, setChatRoomTitle] = useState<string>('');
    const [errors, setErrors] = useState<KeyValueModel | null>(null);

    const chatRoom = useMemo(() => {
      if (chatRoomId && chatRoomsProxy?.length) {
        return chatRoomsProxy.slice().find(chatRoom => chatRoom.id === chatRoomId)
      }

      return null
    }, [chatRoomId, chatRoomsProxy])

    useEffect(() => {
      if (chatRoom?.title) {
        setChatRoomTitle(chatRoom.title);
      }
    }, [chatRoom?.title])

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

      if (chatRoomTitle.length < 3) {
        setErrors({ title: "Chat room title cannot contain less than 3 characters"})
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
          <View style={$inputContainers}>
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
          </View>
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
  alignSelf: 'center',
  marginBottom: spacing.md,
}

const $pageContent: ViewStyle = {
  display: 'flex',
  width: '100%',
  height: 'calc(100% - 56px)',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: spacing.md,
}

const $inputContainers: ViewStyle = {
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
}

const $textField: ViewStyle = {
  marginBottom: spacing.lg,
}

const $tapButton: ViewStyle = {
  width: '100%',
  marginTop: spacing.xs,
}

// #endregion