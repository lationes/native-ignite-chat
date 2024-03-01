import Api from "./api";
import {GetChatRoomsParams, CUChatRoomPayload } from "app/types/chatroom.types"
import { ChatRoom } from "app/models/ChatRoom"

class ChatRoomApi extends Api {

  constructor() {
    super();
  }

  async getChatRooms(params: GetChatRoomsParams): Promise<ChatRoom[]> {
    return Api.get({ route: '/chatroom', needAuth: true, params })
  }

  async createChatRoom(data: CUChatRoomPayload): Promise<ChatRoom> {
    return Api.post({ route: '/chatroom', needAuth: true, data })
  }

  async updateChatRoom(chatRoomId: number, data: CUChatRoomPayload): Promise<ChatRoom> {
    return Api.patch({ route: `/chatroom/${chatRoomId}`, needAuth: true, data })
  }

  async connectUserToChatRoom(chatRoomId: number): Promise<ChatRoom> {
    return Api.patch({ route: `/chatroom/connect/${chatRoomId}`, needAuth: true })
  }

  async deleteChatRoom(chatRoomId: number): Promise<ChatRoom> {
    return Api.delete({ route: `/chatroom/${chatRoomId}`, needAuth: true })
  }
}

const api = new ChatRoomApi();
export default api;

