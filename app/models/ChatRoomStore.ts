import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { ChatRoom, ChatRoomModel } from "./ChatRoom"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { CUChatRoomPayload, GetChatRoomsParams } from "app/types/chatroom.types"
import ChatRoomApi from "app/services/api/chatRoom.api"

export const ChatRoomStoreModel = types
  .model("ChatRoomStore")
  .props({
    chatRooms: types.optional(types.array(ChatRoomModel), []),
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    async fetchChatRooms(params: GetChatRoomsParams) {
      const response = await ChatRoomApi.getChatRooms(params);

      if (response) {
        store.setProp("chatRooms", response)
      }
    },
    async createChatRoom(data: CUChatRoomPayload) {
      const chatRooms = [...(store.chatRooms || [] as ChatRoom[])];

      const response = await ChatRoomApi.createChatRoom(data);

      if (response) {
        chatRooms.push(response);
        store.setProp("chatRooms", chatRooms);
      }
    },
    async updateChatRoom(data: CUChatRoomPayload) {
      const chatRooms = [...(store.chatRooms || [] as ChatRoom[])];

      const response = await ChatRoomApi.createChatRoom(data);

      if (response) {
        chatRooms.push(response);
        store.setProp("chatRooms", chatRooms);
      }
    },
    async connectUserToChatRoom(chatRoomId: number) {
      const chatRooms = [...(store.chatRooms || [] as ChatRoom[])];

      const response = await ChatRoomApi.connectUserToChatRoom(chatRoomId);

      if (response) {
        chatRooms.push(response);
        store.setProp("chatRooms", chatRooms);
      }
    },
    async deleteChatRoom(chatRoomId: number) {
      const chatRooms = [...(store.chatRooms || [] as ChatRoom[])];

      const response = await ChatRoomApi.deleteChatRoom(chatRoomId);

      if (response) {
        const deleteIndex = chatRooms.findIndex(chatRoom => chatRoom.id === chatRoomId);
        chatRooms.splice(deleteIndex, 0);
        store.setProp("chatRooms", chatRooms);
      }
    },
  }))

export interface ChatRoomStore extends Instance<typeof ChatRoomStoreModel> {}
export interface ChatRoomStoreSnapshot extends SnapshotOut<typeof ChatRoomStoreModel> {}
