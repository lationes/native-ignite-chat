import Api from "./api";
import { Message } from "app/models/Message"
import { CreateMessagePayload, UpdateMessagePayload } from "app/types/message.types"

class MessageApi extends Api {

  constructor() {
    super();
  }

  async getMessagesByChatRoomId(chatRoomId: number): Promise<Message[]> {
    return Api.get({ route: `/message/chatroom/${chatRoomId}`, needAuth: true })
  }

  async createMessage(data: CreateMessagePayload): Promise<Message> {
    return Api.post({ route: '/message', needAuth: true, data })
  }

  async updateMessage(messageId: number, data: UpdateMessagePayload): Promise<Message> {
    return Api.patch({ route: `/message/${messageId}`, needAuth: true, data })
  }

  async deleteMessage(messageId: number): Promise<Message> {
    return Api.delete({ route: `/message/${messageId}`, needAuth: true })
  }
}

const api = new MessageApi();
export default api;

