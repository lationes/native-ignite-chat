import Api from "./api";
import { AddRequest } from "app/models/AddRequest"
import { CreateAddRequestPayload } from "app/types/add-request.types"

class AddRequestApi extends Api {

  constructor() {
    super();
  }

  async getAddRequestsByUserId(userId: number): Promise<AddRequest[]> {
    return Api.get({ route: `/add-request/${userId}`, needAuth: true })
  }

  async createAddRequest(data: CreateAddRequestPayload): Promise<AddRequest> {
    return Api.post({ route: '/add-request', needAuth: true, data })
  }

  async acceptAddRequest(id: number): Promise<AddRequest> {
    return Api.post({ route: `/add-request/accept/${id}`, needAuth: true })
  }

  async deleteAddRequest(addRequestId: number): Promise<AddRequest> {
    return Api.delete({ route: `/add-request/${addRequestId}`, needAuth: true })
  }
}

const api = new AddRequestApi();
export default api;

