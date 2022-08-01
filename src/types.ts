export interface ErrorType {
  errorsMessages: {
    message: string;
    field: string;
  }[];
  //resultCode: 0 | 1 | 2;
}

export interface PaginationType {
  pageNumber?: number;
  pageSize?: number;
}

export interface RequestAttemptType {
  ip: string;
  date: Date;
  path: string;
}

export interface ResponseType<T> {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Array<T>;
}

export type DBType<T> = {
  items: T[];
  pagination: [{ totalCount: number }];
};

export type ServiceResponseType<
  D = { accessToken?: string | null; refreshToken?: string | null },
> = {
  resultCode: number;
  data: D;
};
