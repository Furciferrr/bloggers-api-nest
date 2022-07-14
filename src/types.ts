import { WithId } from 'mongodb';

export interface Blogger {
  id: string;
  name: string;
  youtubeUrl: string;
}

export interface Post {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  bloggerId: string;
  bloggerName: string;
}

export interface VideoType {
  id: number;
  title: string;
  author: string;
}

enum Errors {
  noContent = 204,
  notFound = 404,
  badRequest = 400,
}

export interface BloggerBodyType {
  name: string;
  youtubeUrl: string;
}

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

export interface CommentDBType {
  id: string;
  content: string;
  userId: string;
  userLogin: string;
  addedAt: string;
  postId: string;
}

export type DBType<T> = {
  items: T[];
  pagination: [{ totalCount: number }];
};

export type CommentResponse = Omit<CommentDBType, 'postId'>;

export type ServiceResponseType<
  D = { accessToken?: string | null; refreshToken?: string | null },
> = {
  resultCode: number;
  data: D;
};
