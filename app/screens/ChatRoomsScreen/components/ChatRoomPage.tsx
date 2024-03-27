import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useMemo, useState } from "react"
import {
  ActivityIndicator,
  ImageStyle,
  View,
  ViewStyle,
} from "react-native"
import { type ContentStyle } from "@shopify/flash-list"
import {
  EmptyState,
  ListView,
  Text,
} from "app/components"
import { isRTL } from "app/i18n"
import { useStores } from "app/models"
import { spacing } from "app/theme"
import { Message } from "app/models/Message"
import { MessageCard } from "app/screens/ChatRoomsScreen/components/MessageCard"
import { MessageEditor } from "app/screens/ChatRoomsScreen/components/MessageEditor"
import ConfirmationModal from "app/components/ConfirmationModal"

interface IProps {
  chatRoomId: number | undefined;
  navigateToChatRoom: (chatRoomId: number | 'new') => void,
}


export const ChatRoomPage: FC<IProps> = observer(
  function ChatRoomPage({ chatRoomId, navigateToChatRoom }) {
    const {
      chatRoomStore: { chatRooms, loading: chatRoomLoading },
      messageStore: { messages, loading: messagesLoading, getMessagesByChatRoomId, deleteMessage }
    } = useStores();

    const chatRoomsProxy = chatRooms.slice();
    const messagesProxy = messages.slice();

    const [editedMessageId, setEditedMessageId] = useState<number | null>(null)
    const [messageToDeleteId, setMessageToDeleteId] = useState<number | null>(null)
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState<boolean>(false)
    const [messageEditorOpen, setMessageEditorOpen] = useState<boolean>(false);

    const isMessagesLoading = useMemo(() => {
      return messagesLoading.action === 'get' && messagesLoading.loading;
    }, [messagesLoading])

    const isChatRoomLoading = useMemo(() => {
      return chatRoomLoading.action === 'get' && chatRoomLoading.loading;
    }, [chatRoomLoading])

    const chatRoom = useMemo(() => {
      if (chatRoomId && chatRoomsProxy?.length) {
        return chatRoomsProxy.slice().find(chatRoom => chatRoom.id === chatRoomId)
      }

      return null
    }, [chatRoomId, chatRoomsProxy])

    useEffect(() => {
      if (chatRoomId) {
        getMessages(chatRoomId)
      }
    }, [chatRoomId])

    async function getMessages(chatRoomId: number) {
      await getMessagesByChatRoomId(chatRoomId);
    }

    async function manualRefresh() {
      if (chatRoomId) {
        await getMessages(chatRoomId)
      }
    }

    const handleEditMessage = (messageId?: number) => {
      if (messageId) {
        setEditedMessageId(messageId);
      }
    }

    const handleDeleteMessage = (messageId?: number) => {
      if (messageId) {
        setMessageToDeleteId(messageId);
        setDeleteConfirmationOpen(true);
      }
    }

    const okDeleteCallback = async () => {
      if (messageToDeleteId) {
        await deleteMessage(messageToDeleteId);
      }
    }

    const manageMassageEditor = (open: boolean) => {
      setMessageEditorOpen(open);

      if (!open) {
        setEditedMessageId(null);
      }
    }

    return (
      <>
        <View style={$heading}>
          <Text preset="heading" tx="chatRoomScreen.title" txOptions={{ title: chatRoom?.title || ''}} />
        </View>
        { isChatRoomLoading ? (
          <ActivityIndicator />
        ) : null }
        { !isChatRoomLoading && !chatRoom ? (
          <EmptyState
            preset="generic"
            style={$emptyState}
            headingTx={"chatRoomScreen.noChatRoomEmptyState.heading"}
            contentTx={"chatRoomScreen.noChatRoomEmptyState.content"}
            buttonTx={ "chatRoomScreen.createChatRoomButton.title"}
            buttonOnPress={() => navigateToChatRoom('new')}
            imageStyle={$emptyStateImage}
            ImageProps={{ resizeMode: "contain" }}
          />
        ) : null }
        { chatRoom ? (
          <ListView<Message>
            contentContainerStyle={$listContentContainer}
            data={messagesProxy || []}
            refreshing={isMessagesLoading}
            onRefresh={manualRefresh}
            ListEmptyComponent={
              isMessagesLoading ? (
                <ActivityIndicator />
              ) : (
                <EmptyState
                  preset="generic"
                  style={$emptyState}
                  headingTx={"chatRoomScreen.noMessagesEmptyState.heading"}
                  contentTx={"chatRoomScreen.noMessagesEmptyState.content"}
                  button={''}
                  buttonOnPress={manualRefresh}
                  imageStyle={$emptyStateImage}
                  ImageProps={{ resizeMode: "contain" }}
                />
              )
            }
            renderItem={({ item }) => (
              <MessageCard
                messageId={item.id}
                editMessage={handleEditMessage}
                deleteMessage={handleDeleteMessage}
              />
            )}
          />
        ) : null}
        <MessageEditor open={messageEditorOpen} setOpen={manageMassageEditor} messageId={editedMessageId} chatRoomId={chatRoom?.id || 0} />
        <ConfirmationModal open={deleteConfirmationOpen} setOpen={setDeleteConfirmationOpen} titleTx={"chatRoomScreen.deleteConfirmation.title"} okCallback={okDeleteCallback} />
      </>
    )
  },
)

// #region Styles

const $listContentContainer: ContentStyle = {
  paddingHorizontal: spacing.md,
}

const $heading: ViewStyle = {
  marginBottom: spacing.md,
  paddingHorizontal: spacing.md
}

const $emptyState: ViewStyle = {
  marginTop: spacing.xxl,
}

const $emptyStateImage: ImageStyle = {
  transform: [{ scaleX: isRTL ? -1 : 1 }],
}

// #endregion