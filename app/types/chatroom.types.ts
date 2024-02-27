import { FindManyParamsModel } from "app/types/common.types"

export interface CUChatRoomPayload {
  title: string;
}

export interface GetChatRoomsParams extends FindManyParamsModel {}
