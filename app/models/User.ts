import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"

/**
 * This represents a User of React Native Chat.
 */
export const UserModel = types
  .model("User")
  .props({
    id: types.number,
    email: types.string,
    avatar: types.maybeNull(types.string),
    banned: types.maybeNull(types.boolean),
    banReason: types.maybeNull(types.string),
    role: types.string,
    createdAt: types.string,
    updatedAt: types.maybeNull(types.string),
})

export interface User extends Instance<typeof UserModel> {}
export interface UserSnapshotOut extends SnapshotOut<typeof UserModel> {}
export interface UserSnapshotIn extends SnapshotIn<typeof UserModel> {}
