import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { Message, MessageModel } from "app/models/Message"
import MessageApi from "app/services/api/message.api"
import { CreateMessagePayload, UpdateMessagePayload } from "app/types/message.types"

export const MessageStoreModel = types
  .model("Messages")
  .props({
    messages: types.optional(types.array(MessageModel), []),
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    async getMessagesByChatRoomId(chatRoomId: number) {
      const response = await MessageApi.getMessagesByChatRoomId(chatRoomId);

      if (response) {
        store.setProp("messages", response)
      }
    },
    async createMessage(data: CreateMessagePayload) {
      const messages = [...(store.messages || [] as Message[])];

      const response = await MessageApi.createMessage(data);

      if (response) {
        messages.push(response);
        store.setProp("messages", messages);
      }
    },
    async updateChatRoom(data: UpdateMessagePayload) {
      const messages = [...(store.messages || [] as Message[])];

      const response = await MessageApi.updateMessage(data);

      if (response) {
        messages.push(response);
        store.setProp("messages", messages);
      }
    },
    async deleteChatRoom(messageId: number) {
      const messages = [...(store.messages || [] as Message[])];

      const response = await MessageApi.deleteMessage(messageId);

      if (response) {
        const deleteIndex = messages.findIndex(message => message.id === messageId);
        messages.splice(deleteIndex, 0);
        store.setProp("messages", messages);
      }
    },
  }))

export interface MessageStore extends Instance<typeof MessageStoreModel> {}
export interface MessageStoreSnapshot extends SnapshotOut<typeof MessageStoreModel> {}
