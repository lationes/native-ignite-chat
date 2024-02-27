import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { email as emailValidator, validate, Validator } from "app/helpers/validator.helpers"
import { AuthorizationData, TokenPairModel } from "app/types/authorization.types"
import AuthApi from '../services/api/authorization.api';
import { AxiosError } from "axios/index"
import { ResponseErrorData } from "app/types/common.types"

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
    authData: types.optional(AuthorizationDataModel, { email: '', password: ''}),
    error: types.maybe(types.string),
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
    setAuthData(data: AuthorizationData) {
      store.authData = data;
    },
    clearAuthData() {
      store.refreshToken = undefined;
      store.accessToken = undefined;
      store.authData = { email: '', password: ''};
    },
    setError(error: string | undefined) {
      store.error = error;
    }
  }))
  .views((store) => ({
    get isAuthenticated() {
      return !!store.accessToken
    },
    get validationError() {
      const { email, password } = store.authData;

      const { errors: existenceErrors} = validate(validator, { email, password });

      if (existenceErrors && Object.values(existenceErrors).length) {
        return existenceErrors;
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
    async login() {
      try {
        const loginResponse = await AuthApi.login(store.authData);

        if (loginResponse) {
          store.setTokenPair(loginResponse);
          store.setError(undefined);
        }
      } catch (e) {
        const error = e as AxiosError<ResponseErrorData>;
        store.setError(error.response?.data.message as string);
      }
    },
    async registration() {
      try {
        const registrationResponse = await AuthApi.registration(store.authData);

        if (registrationResponse) {
          store.setTokenPair(registrationResponse);
          store.setError(undefined);
        }
      } catch (e) {
        const error = e as AxiosError<ResponseErrorData>;
        store.setError(error.response?.data.message as string);
      }
    },
    async logout() {
      const logoutResponse = await AuthApi.logout();

      if (logoutResponse) {
        store.clearAuthData();
      }
    },
  }))

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}
