import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { User, UserModel } from "app/models/User"
import UserApi from "app/services/api/user.api"
import { GetUsersParams } from "app/types/user.types"
import { LoadingInfo } from "app/types/common.types"

export const UserStoreModel = types
  .model("Messages")
  .props({
    users: types.optional(types.array(UserModel), []),
    error: types.maybe(types.string),
    loading:  types.optional(types.frozen<LoadingInfo>(), { action: '', loading: false }),
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    setError(error: string | undefined) {
      store.error = error;
    },
    setLoading(action: string, loading: boolean) {
      store.loading = { action, loading };
    }
  }))
  .actions((store) => ({
    async getUsers(data: GetUsersParams) {
      store.setLoading('getMany', false);

      const response = await UserApi.getUsers(data);

      if (response) {
        store.setProp("users", response)
      }

      store.setLoading('', false);
    },
    async getUserById(userId: number) {
      store.setLoading('getOne', false);

      const users = [...(store.users || [] as User[])];
      const response = await UserApi.getUserById(userId);

      if (response) {
        const findIndex = users.findIndex(user => user.id === userId);

        if (findIndex !== -1) {
          users.splice(findIndex, 1, response);
        } else {
          users.push(response);
        }

        store.setProp("users", users)
      }

      store.setLoading('', false);
    },
    async deleteUser(userId: number) {
      store.setLoading('delete', false);

      try {
        const users = [...(store.users || [] as User[])];
        const deleteIndex = users.findIndex(user => user.id === userId);
        const userToDelete = {...users[deleteIndex]};

        if (userToDelete.role !== 'ADMIN') {
          throw 'User has no necessary permissions for this operation';
        }

        const response = await UserApi.deleteUser(userId);

        if (response) {
          const deleteIndex = users.findIndex(user => user.id === userId);
          users.splice(deleteIndex, 0);
          store.setProp("users", users);
        }
      } catch (e) {
        store.setError(e as string);
      } finally {
        store.setLoading('', false);
      }
    },
  }))

export interface UserStore extends Instance<typeof UserStoreModel> {}
export interface UserStoreSnapshot extends SnapshotOut<typeof UserStoreModel> {}
