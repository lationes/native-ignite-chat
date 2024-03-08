import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { Message, MessageModel } from "app/models/Message"
import MessageApi from "app/services/api/message.api"
import { UpdateMessagePayload, CreateMessagePayload } from "app/types/message.types"
import { LoadingInfo } from "app/types/common.types"

export const MessageStoreModel = types
  .model("Messages")
  .props({
    messages: types.optional(types.array(MessageModel), []),
    loading:  types.optional(types.frozen<LoadingInfo>(), { action: '', loading: false }),
  })
  .actions((store) => ({
    setLoading(action: string, loading: boolean) {
      store.loading = { action, loading };
    },
    setMessages(messages: Message[]) {
      store.messages.replace(messages);
    },
    addMessage(message: Message) {
      store.messages.push(message);
    },
    updateMessageById(messageId: number, updatedMessage: Message) {
      const index = store.messages.findIndex(message => message.id === messageId);
      if (index !== -1) {
        store.messages.splice(index, 1, updatedMessage);
      }
    },
    deleteMessageById(messageId: number) {
      const index = store.messages.findIndex(message => message.id === messageId);
      if (index !== -1) {
        store.messages.splice(index, 1);
      }
    },
  }))
  .actions((store) => ({
    async getMessagesByChatRoomId(chatRoomId: number, callback?: (data?: Message[]) => void) {
      try {
        store.setLoading('get', true);

        const response = await MessageApi.getMessagesByChatRoomId(chatRoomId);

        if (response) {
          store.setMessages(response);
          callback && callback(response);
        }
      } finally {
        store.setLoading('', false);
      }
    },
    async createMessage(data: CreateMessagePayload, callback?: (data?: Message) => void) {
      try {
        store.setLoading('create', true);

        const response = await MessageApi.createMessage(data);

        if (response) {
          store.addMessage(response);
          callback && callback(response);
        }
      } finally {
        store.setLoading('', false);
      }
    },
    async updateMessage(messageId: number, data: UpdateMessagePayload, callback?: (data?: Message) => void) {
      try {
        store.setLoading('update', true);

        const response = await MessageApi.updateMessage(messageId, data);

        if (response) {
          store.updateMessageById(messageId, response);
          callback && callback(response);
        }
      } finally {
        store.setLoading('', false);
      }
    },
    async deleteMessage(messageId: number, callback?: (data?: Message) => void) {
      try {
        store.setLoading('delete', true);

        const response = await MessageApi.deleteMessage(messageId);

        if (response) {
          store.deleteMessageById(messageId);
          callback && callback(response);
        }
      } finally {
        store.setLoading('', false);
      }
    },
  }))

export interface MessageStore extends Instance<typeof MessageStoreModel> {}
export interface MessageStoreSnapshot extends SnapshotOut<typeof MessageStoreModel> {}