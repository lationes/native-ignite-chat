import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { ChatRoom, ChatRoomModel } from "./ChatRoom"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { CUChatRoomPayload, GetChatRoomsParams } from "app/types/chatroom.types"
import ChatRoomApi from "app/services/api/chatRoom.api"
import { LoadingInfo } from "app/types/common.types"

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
    async fetchChatRooms(params: GetChatRoomsParams) {
      store.setLoading('get', true);

      const response = await ChatRoomApi.getChatRooms(params);

      if (response) {
        store.setProp("chatRooms", response)
      }

      store.setLoading('', false);
    },
    async createChatRoom(data: CUChatRoomPayload) {
      store.setLoading('create', false);

      const chatRooms = [...(store.chatRooms || [] as ChatRoom[])];

      const response = await ChatRoomApi.createChatRoom(data);

      if (response) {
        chatRooms.push(response);
        store.setProp("chatRooms", chatRooms);
      }

      store.setLoading('', false);
    },
    async updateChatRoom(data: CUChatRoomPayload) {
      store.setLoading('update', false);

      const chatRooms = [...(store.chatRooms || [] as ChatRoom[])];

      const response = await ChatRoomApi.createChatRoom(data);

      if (response) {
        chatRooms.push(response);
        store.setProp("chatRooms", chatRooms);
      }

      store.setLoading('', false);
    },
    async connectUserToChatRoom(chatRoomId: number) {
      store.setLoading('connect', false);

      const chatRooms = [...(store.chatRooms || [] as ChatRoom[])];

      const response = await ChatRoomApi.connectUserToChatRoom(chatRoomId);

      if (response) {
        chatRooms.push(response);
        store.setProp("chatRooms", chatRooms);
      }

      store.setLoading('', false);
    },
    async deleteChatRoom(chatRoomId: number) {
      store.setLoading('delete', false);

      const chatRooms = [...(store.chatRooms || [] as ChatRoom[])];

      const response = await ChatRoomApi.deleteChatRoom(chatRoomId);

      if (response) {
        const deleteIndex = chatRooms.findIndex(chatRoom => chatRoom.id === chatRoomId);
        chatRooms.splice(deleteIndex, 0);
        store.setProp("chatRooms", chatRooms);
      }

      store.setLoading('', false);
    },
  }))

export interface ChatRoomStore extends Instance<typeof ChatRoomStoreModel> {}
export interface ChatRoomStoreSnapshot extends SnapshotOut<typeof ChatRoomStoreModel> {}
