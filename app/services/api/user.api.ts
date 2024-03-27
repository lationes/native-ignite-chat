import Api from "./api";
import { BanUserPayloadModel, GetUsersParams, SaveAvatarPayload, UserInfoModel } from "app/types/user.types"
import { User } from "app/models/User"

class UserApi extends Api {

  constructor() {
    super();
  }

  async getUsers(params?: GetUsersParams): Promise<User[]> {
    return Api.get({ route: '/user', needAuth: true, params })
  }

  async getUserById(userId: number): Promise<User> {
    return Api.get({ route: `/user/${userId}`, needAuth: true })
  }

  async updateUser(userId: number, data: UserInfoModel): Promise<User> {
    return Api.patch({ route: `/user/${userId}`, needAuth: true, data })
  }

  async banUser(userId: number, data: BanUserPayloadModel): Promise<User> {
    return Api.patch({ route: `/user/ban/${userId}`, needAuth: true, data })
  }

  async unBanUser(userId: number): Promise<User> {
    return Api.patch({ route: `/user/unban/${userId}`, needAuth: true })
  }

  async changeAvatar(userId: number, data: SaveAvatarPayload): Promise<User> {
    return Api.patch({ route: `/user/avatar/${userId}`, needAuth: true, data, dataType: 'formData'})
  }

  async removeAvatar(userId: number): Promise<User> {
    return Api.patch({ route: `/user/delete-avatar/${userId}`, needAuth: true })
  }

  async deleteUser(userId: number): Promise<User> {
    return Api.delete({ route: `/user/${userId}`, needAuth: true })
  }
}

const api = new UserApi();
export default api;

