export interface AuthorizationData {
  email: string;
  password: string;
}

export interface TokenPairModel {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}