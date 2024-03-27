import { FindManyParamsModel } from "app/types/common.types"
import { SendImagePayload } from "app/types/image.types"

export interface GetUsersParams extends FindManyParamsModel {}

export interface UserInfoModel {
  email: string;
}

export interface SaveAvatarPayload {
  image: SendImagePayload;
}