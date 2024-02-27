import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

/**
 * This represents a User of React Native Chat.
 */
export const MessageModel = types
  .model("User")
  .props({
    id: types.number,
    content: types.string,
    authorId: types.number,
    chatRoomId: types.number,
  })
  .actions(withSetPropAction)

export interface Message extends Instance<typeof MessageModel> {}
export interface MessageSnapshotOut extends SnapshotOut<typeof MessageModel> {}
export interface MessageSnapshotIn extends SnapshotIn<typeof MessageModel> {}
