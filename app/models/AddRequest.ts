import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"

/**
 * This represents request to add user to chat room
 */
export const AddRequestModel = types
  .model("AddRequest")
  .props({
    id: types.number,
    authorId: types.number,
    userId: types.number,
    chatRoomId: types.number,
    message: types.maybeNull(types.string),
    createdAt: types.string,
  })

export interface AddRequest extends Instance<typeof AddRequestModel> {}
export interface AddRequestSnapshotOut extends SnapshotOut<typeof AddRequestModel> {}
export interface AddRequestSnapshotIn extends SnapshotIn<typeof AddRequestModel> {}
