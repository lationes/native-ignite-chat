import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * This represents a User of React Native Chat.
 */
export const UserModel = types
  .model("User")
  .props({
    id: types.number,
    email: types.string,
    avatar: types.string,
    banned: types.boolean,
    banReason: types.string,
    role: types.string,
})
.actions(withSetPropAction)

export interface User extends Instance<typeof UserModel> {}
export interface UserSnapshotOut extends SnapshotOut<typeof UserModel> {}
export interface UserSnapshotIn extends SnapshotIn<typeof UserModel> {}
