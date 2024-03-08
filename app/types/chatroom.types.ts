import { FindManyParamsModel } from "app/types/common.types"
import { ChatRoom } from "app/models/ChatRoom"

export interface CUChatRoomPayload {
  title: string;
}

export interface GetChatRoomsParams extends FindManyParamsModel {}

export interface ChatRoomUserRelationModel {
  assignedAt: string;
  chatRoomId: number;
  userId: number;
}
