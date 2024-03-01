import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { ChatRoom, ChatRoomModel } from "./ChatRoom"
import { withSetPropAction } from "./helpers/withSetPropAction"
import {
  GetChatRoomsParams,
  CUChatRoomPayload,
} from "app/types/chatroom.types"
import ChatRoomApi from "app/services/api/chatRoom.api"
import { LoadingInfo } from "app/types/common.types"
import { fi, tr } from "date-fns/locale"

export const ChatRoomStoreModel = types
  .model("ChatRoomStore")
  .props({
    chatRooms: types.optional(types.array(ChatRoomModel), []),
    loading:  types.optional(types.frozen<LoadingInfo>(), { action: '', loading: false }),
  })
  .actions((store) => ({
    setLoading(action: string, loading: boolean) {
      store.loading = { action, loading };
    }
  }))
  .actions(withSetPropAction)
  .actions((store) => ({
    async fetchChatRooms(params: GetChatRoomsParams, callback?: (data?: ChatRoom[]) => void) {
      try {
        store.setLoading('get', true);

        const response = await ChatRoomApi.getChatRooms(params);

        if (response) {
          store.setProp("chatRooms", response);
          callback && callback(response);
        }
      } finally {
        store.setLoading('', false);
      }
    },
    async createChatRoom(data: CUChatRoomPayload, callback?: (data?: ChatRoom) => void) {
      try {
        store.setLoading('create', false);

        const chatRooms = [...(store.chatRooms || [] as ChatRoom[])];

        const response = await ChatRoomApi.createChatRoom(data);

        if (response) {
          chatRooms.push(response);
          store.setProp("chatRooms", chatRooms);
          callback && callback(response);
        }
      } finally {
        store.setLoading('', false);
      }
    },
    async updateChatRoom(chatRoomId: number, data: CUChatRoomPayload, callback?: (data?: ChatRoom) => void) {
      try {
        store.setLoading('update', false);

        const chatRooms = [...(store.chatRooms || [] as ChatRoom[])];

        const response = await ChatRoomApi.updateChatRoom(chatRoomId, data);

        if (response) {
          const updateIndex = chatRooms.findIndex(chatRoom => chatRoom.id === chatRoomId);
          chatRooms.splice(updateIndex, 1, response);
          store.setProp("chatRooms", chatRooms);
          callback && callback(response);
        }
      } finally {
        store.setLoading('', false);
      }
    },
    async connectUserToChatRoom(chatRoomId: number, callback?: (data?: ChatRoom) => void) {
      try {
        store.setLoading('connect', false);

        const chatRooms = [...(store.chatRooms || [] as ChatRoom[])];

        const response = await ChatRoomApi.connectUserToChatRoom(chatRoomId);

        if (response) {
          const updateIndex = chatRooms.findIndex(chatRoom => chatRoom.id === chatRoomId);
          chatRooms.splice(updateIndex, 1, response);
          store.setProp("chatRooms", chatRooms);
          callback && callback(response);
        }
      } finally {
        store.setLoading('', false);
      }
    },
    async deleteChatRoom(chatRoomId: number, callback?: (data?: ChatRoom) => void) {
      try {
        store.setLoading('delete', false);

        const chatRooms = [...(store.chatRooms || [] as ChatRoom[])];

        const response = await ChatRoomApi.deleteChatRoom(chatRoomId);

        if (response) {
          const deleteIndex = chatRooms.findIndex(chatRoom => chatRoom.id === chatRoomId);
          chatRooms.splice(deleteIndex, 1);
          store.setProp("chatRooms", chatRooms);
          callback && callback(response);
        }
      } finally {
        store.setLoading('', false);
      }
    },
  }))

export interface ChatRoomStore extends Instance<typeof ChatRoomStoreModel> {}
export interface ChatRoomStoreSnapshot extends SnapshotOut<typeof ChatRoomStoreModel> {}
