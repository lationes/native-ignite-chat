import Api from "./api";
import { GetUsersParams } from "app/types/user.types"
import { User } from "app/models/User"

class UserApi extends Api {

  constructor() {
    super();
  }

  async getUsers(params: GetUsersParams): Promise<User[]> {
    return Api.get({ route: '/user', needAuth: true, params })
  }

  async getUserById(userId: number): Promise<User> {
    return Api.get({ route: `/user/${userId}`, needAuth: true })
  }

  async deleteUser(userId: number): Promise<User> {
    return Api.delete({ route: `/user/${userId}`, needAuth: true })
  }
}

const api = new UserApi();
export default api;

