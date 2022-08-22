import mongoose, { ObjectId } from 'mongoose';
import { ReactionViewType, LikeStatus } from '../../../features/reactions/types';

export interface PostDBType {
  id: string;
  _id: ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  bloggerId: string;
  bloggerName: string;
  reactions: ReactionViewType[];
  addedAt: Date;
}

export type ExtendedLikesInfoType = {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
  newestLikes: Array<{
    addedAt: Date;
    userId: string;
    login: string;
  }>;
};

export type PostViewType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  bloggerId: string;
  bloggerName: string;
  addedAt: Date;
  extendedLikesInfo: ExtendedLikesInfoType;
};

export type PaginateType<T> = {
  items: T[];
  pagination: [{ totalCount: number }];
};
