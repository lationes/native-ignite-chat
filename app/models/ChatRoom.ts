import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { UserModel } from "app/models/User"

/**
 * This represents a ChatRoom of React Native Chat.
 */
export const ChatRoomModel = types
  .model("ChatRoom")
  .props({
    id: types.number,
    uniqId: types.string,
    creatorId: types.number,
    title: types.string,
    users: types.array(UserModel),

  })
  .actions(withSetPropAction)

export interface ChatRoom extends Instance<typeof ChatRoomModel> {}
export interface ChatRoomSnapshotOut extends SnapshotOut<typeof ChatRoomModel> {}
export interface ChatRoomSnapshotIn extends SnapshotIn<typeof ChatRoomModel> {}
