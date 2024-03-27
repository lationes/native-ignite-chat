import { FindManyParamsModel } from "app/types/common.types"

export interface CUChatRoomPayload {
  title: string;
}

export interface GetChatRoomsParams extends FindManyParamsModel {}

export interface ChatRoomUserRelationModel {
  assignedAt: string;
  chatRoomId: number;
  userId: number;
}

export interface ConnectChatRoomPayload{
  addRequestId: number;
}
