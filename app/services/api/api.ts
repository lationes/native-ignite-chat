import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import Config from "app/config";
import { _rootStore } from "app/models";
import AuthApi from './authorization.api';
import { KeyValueModel, ResponseErrorData } from "app/types/common.types"

interface RetryQueueItem {
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
  config: AxiosRequestConfig;
}

interface MethodData {
  route: string,
  params?: object | undefined,
  data?: object| undefined,
  appendHeaders?: object,
  needAuth?: boolean,
  dataType?: 'json' | 'formData',
}

interface RequestData extends MethodData {
  method: any,
}

export default class Api {
  static axiosInstance: AxiosInstance;
  static refreshAndRetryQueue: RetryQueueItem[] = [];
  static isRefreshing = false;

  static methods = {
    GET: 'get',
    POST: 'post',
    PATCH: 'patch',
    PUT: 'put',
    DELETE: 'delete',
  };
  constructor() {
    Api.axiosInstance = axios.create({
      baseURL: Config.API_URL,
      timeout: 1000,
      headers: {'Accept': 'application/json'}
    });

    Api.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest: AxiosRequestConfig = error.config;

        if (error.response && error.response.status === 401) {
          if (!Api.isRefreshing) {
            Api.isRefreshing = true;
            try {
              const refreshToken =  _rootStore.authenticationStore.refreshToken;

              if (!refreshToken) {
                throw new Error('Missing refresh token')
              }

              // Refresh the access token
              const refreshData = await AuthApi.refresh({ refreshToken });

              const { accessToken } = refreshData;

              _rootStore.authenticationStore.setTokenPair(refreshData);

              // Update the request headers with the new access token
              error.config.headers['Authorization'] = `Bearer ${accessToken}`;

              // Retry all requests in the queue with the new token
              Api.refreshAndRetryQueue.forEach(({ config, resolve, reject }) => {
                Api.axiosInstance
                  .request(config)
                  .then((response) => resolve(response))
                  .catch((err) => reject(err));
              });

              // Clear the queue
              Api.refreshAndRetryQueue.length = 0;

              // Retry the original request
              return Api.axiosInstance(originalRequest);
            } catch (refreshError) {
              // Handle token refresh error
              // You can clear all storage and redirect the user to the login page
              _rootStore.authenticationStore.clearAuthData();
              throw refreshError;
            } finally {
              Api.isRefreshing = false;
            }
          }

          // Add the original request to the queue
          return new Promise<void>((resolve, reject) => {
            Api.refreshAndRetryQueue.push({ config: originalRequest, resolve, reject });
          });
        }

        // Return a Promise rejection if the status code is not 401
        return Promise.reject(error);
      }
    );
  }

  static get({route, params, needAuth, appendHeaders}: MethodData) {
    return Api.request({route, params, method: Api.methods.GET, appendHeaders, needAuth});
  }

  static put({route, data, dataType, needAuth, appendHeaders}: MethodData) {
    return Api.request({route, data, dataType, method: Api.methods.PUT, appendHeaders, needAuth});
  }

  static patch({route, data, dataType, needAuth, appendHeaders}: MethodData) {
    return Api.request({route, data, dataType, method: Api.methods.PATCH, appendHeaders, needAuth});
  }

  static post({route, data, dataType, needAuth, appendHeaders}: MethodData) {
    return Api.request({route, data, dataType, method: Api.methods.POST, appendHeaders, needAuth});
  }

  static delete({route, params, needAuth, appendHeaders}: MethodData) {
    return Api.request({route, params, method: Api.methods.DELETE, appendHeaders, needAuth});
  }

  static async request({route, params, data, method, dataType = 'json', needAuth, appendHeaders}: RequestData) {
    let headers: any = {};
    let sendData = { ...data } as KeyValueModel;

    if (needAuth) {
      const { accessToken } = _rootStore.authenticationStore;
      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    if (appendHeaders) {
      headers = {...headers, ...appendHeaders};
    }

    if (data) {
      if (dataType === 'formData') {
        const formData = new FormData;
        for (let fieldName in sendData) {
          formData.append(fieldName, sendData[fieldName]);
        }
        sendData = formData;
        headers = { ...headers, 'Content-Type': 'multipart/form-data' };
      }

      if (dataType === 'json') {
        headers = { ...headers, 'Content-Type': 'application/json', };
      }
    }

    return this.axiosInstance.request({
      method,
      url: route,
      headers,
      params,
      data: sendData,
    })
      .then((resp) => {
        return resp.data;
      })
      .catch((err) => {
        Api.handleError(err);
        throw err;
      });
  }

  static handleError(error: AxiosError<ResponseErrorData>) {
    const response = error.response;
    const message = response?.data?.message;
    const status = response?.status;

    if (message && status) {
      console.log(`Error:  ${message} : ${status}`)
    }

    console.log(error);
  }
}