export interface ISuccess {
  message?: string;
  data: object | Array<object> | null;
  status: string;
}

export interface IError {
  message?: string;
  status: string;
}
