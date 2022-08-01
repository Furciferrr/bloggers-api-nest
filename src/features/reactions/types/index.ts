import mongoose from 'mongoose';

export const enum LikeStatus {
  Like = 'Like',
  Dislike = 'Dislike',
  None = 'None',
}

export type ReactionDBType = {
  id: string;
  likeStatus: LikeStatus;
  userId: string;
  addedAt: Date;
  target: {
    type: 'comment' | 'post';
    targetId: mongoose.Types.ObjectId;
  };
  _id: mongoose.Types.ObjectId;
};

export type ReactionViewType = {
  id: string;
  likeStatus: LikeStatus;
  userId: string;
  addedAt: Date;
};
