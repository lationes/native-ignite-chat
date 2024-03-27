import { Instance, SnapshotOut, types } from "mobx-state-tree";
import { AddRequest, AddRequestModel } from "app/models/AddRequest";
import { LoadingInfo, ResponseErrorData } from "app/types/common.types"
import AddRequestApi from "app/services/api/add-request.api";
import { CreateAddRequestPayload } from "app/types/add-request.types";
import { AxiosError } from "axios"

export const AddRequestStoreModel = types
  .model("AddRequestStore")
  .props({
    addRequests: types.optional(types.array(AddRequestModel), []),
    loading: types.optional(types.frozen<LoadingInfo>(), { action: '', loading: false }),
    error: types.maybe(types.string),
  })
  .actions((store) => ({
    setLoading(action: string, loading: boolean) {
      store.loading = { action, loading };
    },
    setError(error: string | undefined) {
      store.error = error;
    },
    setAddRequests(addRequests: AddRequest[]) {
      store.addRequests.replace(addRequests);
    },
    addAddRequest(request: AddRequest) {
      store.addRequests.push(request);
    },
    removeAddRequest(requestId: number) {
      const index = store.addRequests.findIndex(request => request.id === requestId);
      if (index !== -1) {
        store.addRequests.splice(index, 1);
      }
    },
  }))
  .actions((store) => ({
    async getAddRequestsByUserId(userId: number, callback?: (data?: AddRequest[]) => void) {
      try {
        store.setLoading('get', true);

        const response = await AddRequestApi.getAddRequestsByUserId(userId);

        if (response) {
          store.setAddRequests(response);
          callback && callback(response);
        }
      } finally {
        store.setLoading('', false);
      }
    },
    async createAddRequest(data: CreateAddRequestPayload, callback?: (data?: AddRequest) => void) {
      try {
        store.setLoading('create', false);

        const response = await AddRequestApi.createAddRequest(data);

        if (response) {
          callback && callback(response);
        }
      } catch (e) {
        const error = e as AxiosError<ResponseErrorData>;
        store.setError(error.response?.data.message as string);
      } finally {
        store.setLoading('', false);
      }
    },
    async acceptAddRequest(id: number, callback?: (data?: AddRequest) => void) {
      try {
        store.setLoading('accept', false);

        const response = await AddRequestApi.acceptAddRequest(id);

        if (response) {
          store.removeAddRequest(id);
          callback && callback(response);
        }
      } catch (e) {
        const error = e as AxiosError<ResponseErrorData>;
        store.setError(error.response?.data.message as string);
      } finally {
        store.setLoading('', false);
      }
    },
    async deleteAddRequest(addRequestId: number, callback?: (data?: AddRequest) => void) {
      try {
        store.setLoading('delete', false);

        await AddRequestApi.deleteAddRequest(addRequestId);
        store.removeAddRequest(addRequestId);

        callback && callback();
      } finally {
        store.setLoading('', false);
      }
    },
  }))

export interface AddRequestStore extends Instance<typeof AddRequestStoreModel> {}
export interface AddRequestStoreSnapshot extends SnapshotOut<typeof AddRequestStoreModel> {}