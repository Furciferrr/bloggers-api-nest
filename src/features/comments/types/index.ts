import { ObjectId } from 'mongoose';
import { LikeStatus } from '../../../features/reactions/types';

export type CommentDBType = {
  _id: ObjectId;
  id: string;
  content: string;
  userId: string;
  userLogin: string;
  addedAt: string;
  postId: string;
};

export type CommentView = Omit<CommentDBType, 'postId' | '_id'> & {
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
  };
};
