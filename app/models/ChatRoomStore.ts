import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { ChatRoom, ChatRoomModel } from "./ChatRoom"
import {
  GetChatRoomsParams,
  CUChatRoomPayload, ConnectChatRoomPayload,
} from "app/types/chatroom.types"
import ChatRoomApi from "app/services/api/chatRoom.api"
import { LoadingInfo } from "app/types/common.types"

export const ChatRoomStoreModel = types
  .model("ChatRoomStore")
  .props({
    chatRooms: types.optional(types.array(ChatRoomModel), []),
    chatRoomSuggestions: types.optional(types.array(ChatRoomModel), []),
    loading: types.optional(types.frozen<LoadingInfo>(), { action: '', loading: false }),
  })
  .actions((store) => ({
    setLoading(action: string, loading: boolean) {
      store.loading = { action, loading };
    },
    clearChatRoomSuggestions() {
      store.chatRoomSuggestions.clear();
    },
    addChatRoom(chatRoom: ChatRoom) {
      store.chatRooms.push(chatRoom);
    },
    setChatRooms(chatRooms: ChatRoom[]) {
      store.chatRooms.replace(chatRooms);
    },
    setChatRoomSuggestions(chatRooms: ChatRoom[]) {
      store.chatRoomSuggestions.replace(chatRooms);
    },
    updateChatRoomById(chatRoomId: number, updatedChatRoom: ChatRoom) {
      const index = store.chatRooms.findIndex(chatRoom => chatRoom.id === chatRoomId);
      if (index !== -1) {
        store.chatRooms.splice(index, 1, updatedChatRoom);
      }
    },
    removeChatRoomById(chatRoomId: number) {
      const deleteIndex = store.chatRooms.findIndex(chatRoom => chatRoom.id === chatRoomId);
      if (deleteIndex !== -1) {
        store.chatRooms.splice(deleteIndex, 1);
      }
    },
  }))
  .actions((store) => ({
    async fetchAvailableChatRooms(userId: number, params: GetChatRoomsParams, callback?: (data?: ChatRoom[]) => void, storeTo?: 'chatRoomSuggestions' | 'chatRooms') {
      try {
        store.setLoading('get', true);

        const response = await ChatRoomApi.getAvailableChatRooms(userId, params);

        if (response) {
          if (storeTo === 'chatRoomSuggestions') {
            store.setChatRoomSuggestions(response);
          } else {
            store.setChatRooms(response);
          }

          callback && callback(response);
        }
      } finally {
        store.setLoading('', false);
      }
    },
    async createChatRoom(data: CUChatRoomPayload, callback?: (data?: ChatRoom) => void) {
      try {
        store.setLoading('create', false);

        const response = await ChatRoomApi.createChatRoom(data);

        if (response) {
          store.addChatRoom(response);
          callback && callback(response);
        }
      } finally {
        store.setLoading('', false);
      }
    },
    async updateChatRoom(chatRoomId: number, data: CUChatRoomPayload, callback?: (data?: ChatRoom) => void) {
      try {
        store.setLoading('update', false);

        const response = await ChatRoomApi.updateChatRoom(chatRoomId, data);

        if (response) {
          store.updateChatRoomById(chatRoomId, response);
          callback && callback(response);
        }
      } finally {
        store.setLoading('', false);
      }
    },
    async connectUserToChatRoom(chatRoomId: number, data: ConnectChatRoomPayload, callback?: (data?: ChatRoom) => void) {
      try {
        store.setLoading('connect', false);

        const response = await ChatRoomApi.connectUserToChatRoom(chatRoomId, data);

        if (response) {
          store.updateChatRoomById(chatRoomId, response);
          callback && callback(response);
        }
      } finally {
        store.setLoading('', false);
      }
    },
    async deleteChatRoom(chatRoomId: number, callback?: (data?: ChatRoom) => void) {
      try {
        store.setLoading('delete', false);

        const response = await ChatRoomApi.deleteChatRoom(chatRoomId);

        if (response) {
          store.removeChatRoomById(chatRoomId);
          callback && callback(response);
        }
      } finally {
        store.setLoading('', false);
      }
    },
  }))

export interface ChatRoomStore extends Instance<typeof ChatRoomStoreModel> {}
export interface ChatRoomStoreSnapshot extends SnapshotOut<typeof ChatRoomStoreModel> {}