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
  Screen,
  Text,
} from "app/components"
import { isRTL } from "app/i18n"
import { useStores } from "app/models"
import { spacing } from "app/theme"
import { Message } from "app/models/Message"
import { MessageCard } from "app/screens/ChatRoomsScreen/components/MessageCard"
import { JoinedChatRoom } from "app/types/chatroom.types"
import { MessageEditor } from "app/screens/ChatRoomsScreen/components/MessageEditor"
import ConfirmationModal from "app/components/ConfirmationModal"

interface IProps {
  chatRoom: JoinedChatRoom | null;
}


export const ChatRoomView: FC<IProps> = observer(
  function DemoPodcastListScreen({ chatRoom }) {
    const {
      chatRoomStore: { loading: chatRoomLoading, connectUserToChatRoom },
      messageStore: { messages, loading: messagesLoading, getMessagesByChatRoomId, deleteMessage }
    } = useStores();

    const [editedMessageId, setEditedMessageId] = useState<number | null>(null)
    const [messageToDeleteId, setMessageToDeleteId] = useState<number | null>(null)
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState<boolean>(false)
    const [messageEditorOpen, setMessageEditorOpen] = useState<boolean>(false);

    const isLoading = useMemo(() => {
      return messagesLoading.action === 'get' && messagesLoading.loading;
    }, [messagesLoading])

    const editedMessage = useMemo(() => {
      if (editedMessageId && messages) {
        return messages.find(message => message.id === editedMessageId) || null;
      }

      return null;
    }, [editedMessageId, messages]);

    const messageToDelete = useMemo(() => {
      if (messageToDeleteId && messages) {
        return messages.find(message => message.id === messageToDeleteId) || null;
      }

      return null;
    }, [messageToDeleteId, messages]);

    useEffect(() => {
      if (chatRoom) {
        getMessages(chatRoom.id)
      }
    }, [chatRoom])

    async function getMessages(chatRoomId: number) {
      await getMessagesByChatRoomId(chatRoomId);
    }

    async function manualRefresh() {
      if (chatRoom) {
        await getMessages(chatRoom.id)
      }
    }

    const joinChatRoom = async () => {
      if (chatRoom) {
        await connectUserToChatRoom(chatRoom.id);
      }
    }

    const handleeEditMessage = (messageId: number) => {
      setEditedMessageId(messageId);
    }

    const handleDeleteMessage = (messageId: number) => {
      setMessageToDeleteId(messageId);
      setDeleteConfirmationOpen(true);
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
      <Screen
        preset="fixed"
        safeAreaEdges={["top"]}
        contentContainerStyle={$screenContentContainer}
      >
        { chatRoomLoading?.action === 'get' && chatRoomLoading.loading ? (
          <ActivityIndicator />
        ) : null }
        { !chatRoomLoading.loading && !chatRoom ? (
          <EmptyState
            preset="generic"
            style={$emptyState}
            headingTx={"chatRoomScreen.noChatRoomEmptyState.heading"}
            contentTx={"chatRoomScreen.noChatRoomEmptyState.content"}
            button={''}
            buttonOnPress={manualRefresh}
            imageStyle={$emptyStateImage}
            ImageProps={{ resizeMode: "contain" }}
          />
        ) : null }
        { chatRoom && chatRoom?.joined ? (
          <ListView<Message>
            contentContainerStyle={$listContentContainer}
            data={messages || []}
            refreshing={isLoading}
            estimatedItemSize={177}
            onRefresh={manualRefresh}
            ListEmptyComponent={
              isLoading ? (
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
            ListHeaderComponent={
              <View style={$heading}>
                <Text preset="heading" tx="chatRoomScreen.title" txOptions={{ title: chatRoom?.title || ''}} />
              </View>
            }
            renderItem={({ item }) => (
              <MessageCard
                message={item}
                editMessage={handleeEditMessage}
                deleteMessage={handleDeleteMessage}
              />
            )}
          />
        ) : (
          <EmptyState
            preset="generic"
            style={$emptyState}
            headingTx={"chatRoomScreen.noChatRoomAccessEmptyState.heading"}
            contentTx={"chatRoomScreen.noChatRoomAccessEmptyState.content"}
            buttonTx={'chatRoomScreen.noChatRoomAccessEmptyState.button'}
            buttonOnPress={joinChatRoom}
            imageStyle={$emptyStateImage}
            ImageProps={{ resizeMode: "contain" }}
          />
        )}
        <MessageEditor open={messageEditorOpen} setOpen={manageMassageEditor} message={editedMessage} chatRoomId={chatRoom?.id || 0} />
        <ConfirmationModal open={deleteConfirmationOpen} setOpen={setDeleteConfirmationOpen} titleTx={"chatRoomScreen.deleteConfirmation.title"} okCallback={okDeleteCallback} />
      </Screen>
    )
  },
)

// #region Styles
const $screenContentContainer: ViewStyle = {
  flex: 1,
}

const $listContentContainer: ContentStyle = {
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.lg + spacing.xl,
  paddingBottom: spacing.lg,
}

const $heading: ViewStyle = {
  marginBottom: spacing.md,
}

const $emptyState: ViewStyle = {
  marginTop: spacing.xxl,
}

const $emptyStateImage: ImageStyle = {
  transform: [{ scaleX: isRTL ? -1 : 1 }],
}

// #endregion