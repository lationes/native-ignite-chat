import Api from "./api";
import { TokenPairModel, AuthorizationData, RefreshTokenPayload, UserTokensModel } from "app/types/authorization.types"
import { CommonMessageResponse } from "app/types/common.types"

class AuthApi extends Api {

  constructor() {
    super();
  }

  async login(data: AuthorizationData): Promise<UserTokensModel> {
    return Api.post({ route: '/authorization/login', needAuth: false, data })
  }

  async registration(data: AuthorizationData): Promise<UserTokensModel> {
    return Api.post({ route: '/authorization/registration', needAuth: false, data })
  }

  async logout(): Promise<CommonMessageResponse>  {
    return Api.post({ route: '/authorization/logout', needAuth: true })
  }

  async refresh(data: RefreshTokenPayload): Promise<TokenPairModel> {
    return Api.post({ route: '/authorization/refresh', needAuth: false, data})
  }
}

const api = new AuthApi();
export default api;

