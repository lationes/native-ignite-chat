import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { User, UserModel } from "app/models/User"
import UserApi from "app/services/api/user.api"
import { BanUserPayloadModel, GetUsersParams, SaveAvatarPayload, UserInfoModel } from "app/types/user.types"
import { LoadingInfo } from "app/types/common.types"

export const UserStoreModel = types
  .model("UserStore")
  .props({
    users: types.optional(types.array(UserModel), []),
    userSuggestions: types.optional(types.array(UserModel), []),
    error: types.maybe(types.string),
    loading: types.optional(types.frozen<LoadingInfo>(), { action: '', loading: false }),
  })
  .actions((store) => ({
    setError(error: string | undefined) {
      store.error = error;
    },
    clearError() {
      store.error = '';
    },
    setLoading(action: string, loading: boolean) {
      store.loading = { action, loading };
    },
    clearUserSuggestions() {
      store.userSuggestions.clear();
    },
    setUsers(users: User[]) {
      store.users.replace(users);
    },
    setUserSuggestions(userSuggestions: User[]) {
      store.userSuggestions.replace(userSuggestions);
    },
  }))
  .actions((store) => ({
    async getUsers(data: GetUsersParams, callback?: (data?: User[]) => void, storeTo?: 'userSuggestions' | 'users') {
      try {
        store.setLoading('getMany', true);
        const response = await UserApi.getUsers(data);

        if (response) {
          if (storeTo === 'userSuggestions') {
            store.setUserSuggestions(response);
          } else {
            store.setUsers(response);
          }
          callback && callback(response);
          store.clearError();
        }
      } finally {
        store.setLoading('', false);
      }
    },
    async getUserById(userId: number, callback?: (data?: User) => void) {
      try {
        store.setLoading('getOne', true);
        const users = store.users.slice();
        const response = await UserApi.getUserById(userId);

        if (response) {
          const findIndex = users.findIndex(user => user.id === userId);

          if (findIndex !== -1) {
            users.splice(findIndex, 1, response);
          } else {
            users.push(response);
          }

          store.setUsers(users);
          callback && callback(response);
          store.clearError();
        }
      } finally {
        store.setLoading('', false);
      }
    },
    async updateUser(userId: number, data: UserInfoModel, callback?: (data?: User) => void) {
      try {
        store.setLoading('update', true);
        const users = store.users.slice();

        const response = await UserApi.updateUser(userId, data);

        if (response) {
          const updateIndex = users.findIndex(user => user.id === userId);
          users.splice(updateIndex, 1, response);
          store.setUsers(users);
          callback && callback(response);
          store.clearError();
        }
      } catch (e) {
        store.setError(e.message);
      } finally {
        store.setLoading('', false);
      }
    },
    async banUser(userId: number, data: BanUserPayloadModel, callback?: (data?: User) => void) {
      try {
        store.setLoading('ban', true);
        const users = store.users.slice();

        const response = await UserApi.banUser(userId, data);

        if (response) {
          const updateIndex = users.findIndex(user => user.id === userId);
          users.splice(updateIndex, 1, response);
          store.setUsers(users);
          callback && callback(response);
          store.clearError();
        }
      } catch (e) {
        store.setError(e.message);
      } finally {
        store.setLoading('', false);
      }
    },
    async unBanUser(userId: number, callback?: (data?: User) => void) {
      try {
        store.setLoading('unban', true);
        const users = store.users.slice();

        const response = await UserApi.unBanUser(userId);

        if (response) {
          const updateIndex = users.findIndex(user => user.id === userId);
          users.splice(updateIndex, 1, response);
          store.setUsers(users);
          callback && callback(response);
          store.clearError();
        }
      } catch (e) {
        store.setError(e.message);
      } finally {
        store.setLoading('', false);
      }
    },
    async changeAvatar(userId: number, data: SaveAvatarPayload, callback?: (data?: User) => void) {
      try {
        store.setLoading('update-image', true);
        const users = store.users.slice();

        const response = await UserApi.changeAvatar(userId, data);

        if (response) {
          const updateIndex = users.findIndex(user => user.id === userId);
          users.splice(updateIndex, 1, response);
          store.setUsers(users);
          callback && callback(response);
          store.clearError();
        }
      } catch (e) {
        store.setError(e.message);
      } finally {
        store.setLoading('', false);
      }
    },
    async removeAvatar(userId: number, callback?: (data?: User) => void) {
      try {
        store.setLoading('delete-image', true);
        const users = store.users.slice();

        const response = await UserApi.removeAvatar(userId);

        if (response) {
          const updateIndex = users.findIndex(user => user.id === userId);
          users.splice(updateIndex, 1, response);
          store.setUsers(users);
          callback && callback(response);
          store.clearError();
        }
      } catch (e) {
        store.setError(e.message);
      } finally {
        store.setLoading('', false);
      }
    },
    async deleteUser(userId: number, callback?: (data?: User) => void) {
      try {
        store.setLoading('delete', true);
        const users = store.users.slice(); // Using slice() for creating a shallow copy
        const deleteIndex = users.findIndex(user => user.id === userId);
        const userToDelete = users[deleteIndex];

        if (userToDelete && userToDelete.role !== 'ADMIN') {
          throw new Error('User has no necessary permissions for this operation');
        }

        const response = await UserApi.deleteUser(userId);

        if (response) {
          users.splice(deleteIndex, 1);
          store.setUsers(users);
          callback && callback(response);
          store.clearError();
        }
      } catch (e) {
        store.setError(e.message);
      } finally {
        store.setLoading('', false);
      }
    },
  }))

export interface UserStore extends Instance<typeof UserStoreModel> {}
export interface UserStoreSnapshot extends SnapshotOut<typeof UserStoreModel> {}