export interface UpdateMessagePayload {
  content: string;
}

export interface CreateMessagePayload extends UpdateMessagePayload {
  chatRoomId: number;
}