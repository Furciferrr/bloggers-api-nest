import mongoose, { ObjectId } from 'mongoose';
import { ReactionViewType, LikeStatus } from 'src/features/reactions/types';

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
  newestLikes: Array<Omit<ReactionViewType, 'id'>>;
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
