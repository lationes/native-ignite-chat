import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { AuthenticationStoreModel } from "./AuthenticationStore"
import { ChatRoomStoreModel } from "./ChatRoomStore"
import { MessageStoreModel } from "./MessageStore"
import { UserStoreModel } from "./UserStore"
import { AddRequestStoreModel } from "app/models/AddRequestStore"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  authenticationStore: types.optional(AuthenticationStoreModel, {}),
  chatRoomStore: types.optional(ChatRoomStoreModel, {}),
  messageStore: types.optional(MessageStoreModel, {}),
  userStore: types.optional(UserStoreModel, {}),
  addRequestStore: types.optional(AddRequestStoreModel, {}),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
