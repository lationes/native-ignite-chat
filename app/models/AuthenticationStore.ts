import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { email as emailValidator, validate, Validator } from "app/helpers/validator.helpers"
import { AuthorizationData, TokenPairModel, UserTokensModel } from "app/types/authorization.types"
import AuthApi from '../services/api/authorization.api';
import { AxiosError } from "axios/index"
import { LoadingInfo, ResponseErrorData } from "app/types/common.types"
import { User } from "app/models/User"

const validator: Validator = {
  required: ['email', 'password']
}

const AuthorizationDataModel = types.model({
  email: types.optional(types.string, ''),
  password: types.optional(types.string, ''),
})

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    accessToken: types.maybe(types.string),
    refreshToken: types.maybe(types.string),
    authenticatedUserId: types.maybe(types.number),
    authenticatedUserRole: types.maybe(types.string),
    authData: types.optional(AuthorizationDataModel, { email: '', password: ''}),
    error: types.maybe(types.string),
    loading:  types.optional(types.frozen<LoadingInfo>(), { action: '', loading: false }),
  })
  .actions((store) => ({
    setAccessToken(value?: string) {
      store.accessToken = value
    },
    setRefreshToken(value?: string) {
      store.refreshToken = value
    },
    setTokenPair(data: TokenPairModel) {
      store.accessToken = data.accessToken;
      store.refreshToken = data.refreshToken;
    },
    setAuthenticatedUser(user: User) {
      store.authenticatedUserId = user.id;
      store.authenticatedUserRole = user.role;
    },
    setAuthData(data: AuthorizationData) {
      store.authData = data;
    },
    clearAuthData() {
      store.refreshToken = undefined;
      store.accessToken = undefined;
      store.authData = { email: '', password: ''};
      store.authenticatedUserId = undefined;
      store.authenticatedUserRole = undefined;
    },
    setError(error: string | undefined) {
      store.error = error;
    },
    clearError() {
      store.error = '';
    },
    setLoading(action: string, loading: boolean) {
      store.loading = { action, loading };
    }
  }))
  .views((store) => ({
    get isAuthenticated() {
      return !!store.accessToken
    },
    get isAdmin() {
      return store.authenticatedUserRole === 'ADMIN';
    },
    get validationError() {
      const { email, password } = store.authData;

      const { errors: existenceErrors} = validate(validator, { email, password });

      if (existenceErrors && Object.values(existenceErrors).length) {
        return existenceErrors;
      }

      if (email.length < 3) {
        return { email: 'Email cannot contain less than 3 characters' };
      }

      const { error, validate: validateEmail } = emailValidator({ email });

      const isEmailValid = validateEmail(email || '');

      if (!isEmailValid) {
        return { email: error };
      }

      return {};
    },
  }))
  .actions((store) => ({
    async login(callback?: (data?: UserTokensModel) => void) {
      try {
        store.setLoading('login', true);
        const loginResponse = await AuthApi.login(store.authData);

        if (loginResponse) {
          store.setTokenPair(loginResponse);
          store.setAuthenticatedUser(loginResponse.user);
          store.clearError();
          callback && callback(loginResponse);
        }
      } catch (e) {
        const error = e as AxiosError<ResponseErrorData>;
        store.setError(error.response?.data.message as string);
      } finally {
        store.setLoading('', false);
      }
    },
    async registration(callback?: (data?: UserTokensModel) => void) {
      try {
        store.setLoading('registration', true);
        const registrationResponse = await AuthApi.registration(store.authData);

        if (registrationResponse) {
          store.setTokenPair(registrationResponse);
          store.setAuthenticatedUser(registrationResponse.user);
          store.setError(undefined);
          callback && callback(registrationResponse);
          store.clearError();
        }
      } catch (e) {
        const error = e as AxiosError<ResponseErrorData>;
        store.setError(error.response?.data.message as string);
      } finally {
        store.setLoading('', false);
      }
    },
    async logout(callback?: () => void) {
      try {
        store.setLoading('logout', true);
        const logoutResponse = await AuthApi.logout();

        if (logoutResponse) {
          store.clearAuthData();
          store.clearError();
          callback && callback();
        }
      } finally {
        store.setLoading('', false);
      }
    },
  }))

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}
