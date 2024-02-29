import { User } from "app/models/User"

export interface AuthorizationData {
  email: string;
  password: string;
}

export interface TokenPairModel {
  accessToken: string;
  refreshToken: string;
}

export interface UserTokensModel  extends TokenPairModel {
  user: User;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}