import { ObjectId } from 'mongoose';
import { LikeStatus } from '../types';

export class CreateReactionDto {
  userId: string;
  target: {
    type: {
      type: 'comment' | 'post';
      targetId: ObjectId;
    };
  };
  likeStatus: LikeStatus;
}
