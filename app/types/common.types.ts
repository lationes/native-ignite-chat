export interface ForceDeleteModel {
  force_delete?: 0 | 1;
}

export interface KeyValueModel<T = any> {
  [prop: string]: T;
}

export interface CommonItemModel {
  id: number | string;
  title: string;
}

export interface CommonMessageResponse {
  message: string;
}

export interface ResponseErrorData {
  message: string;
}

export interface FindManyParamsModel {
  search?: string;
}
