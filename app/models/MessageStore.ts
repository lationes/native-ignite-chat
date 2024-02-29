import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { Message, MessageModel } from "app/models/Message"
import MessageApi from "app/services/api/message.api"
import { CreateMessagePayload, UpdateMessagePayload } from "app/types/message.types"
import { LoadingInfo } from "app/types/common.types"

export const MessageStoreModel = types
  .model("Messages")
  .props({
    messages: types.optional(types.array(MessageModel), []),
    loading:  types.optional(types.frozen<LoadingInfo>(), { action: '', loading: false }),
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    setLoading(action: string, loading: boolean) {
      store.loading = { action, loading };
    }
  }))
  .actions((store) => ({
    async getMessagesByChatRoomId(chatRoomId: number) {
      store.setLoading('get', true);

      const response = await MessageApi.getMessagesByChatRoomId(chatRoomId);

      if (response) {
        store.setProp("messages", response)
      }

      store.setLoading('', false);
    },
    async createMessage(data: CreateMessagePayload) {
      store.setLoading('create', true);

      const messages = [...(store.messages || [] as Message[])];

      const response = await MessageApi.createMessage(data);

      if (response) {
        messages.push(response);
        store.setProp("messages", messages);
      }

      store.setLoading('', false);
    },
    async updateMessage(data: UpdateMessagePayload) {
      store.setLoading('update', true);

      const messages = [...(store.messages || [] as Message[])];

      const response = await MessageApi.updateMessage(data);

      if (response) {
        messages.push(response);
        store.setProp("messages", messages);
      }

      store.setLoading('', false);
    },
    async deleteMessage(messageId: number) {
      store.setLoading('delete', true);

      const messages = [...(store.messages || [] as Message[])];

      const response = await MessageApi.deleteMessage(messageId);

      if (response) {
        const deleteIndex = messages.findIndex(message => message.id === messageId);
        messages.splice(deleteIndex, 0);
        store.setProp("messages", messages);
      }

      store.setLoading('', false);
    },
  }))

export interface MessageStore extends Instance<typeof MessageStoreModel> {}
export interface MessageStoreSnapshot extends SnapshotOut<typeof MessageStoreModel> {}
