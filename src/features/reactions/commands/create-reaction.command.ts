import { ObjectId } from 'mongoose';
import { LikeStatus } from '../types';

export class CreateReactionCommand {
  constructor(
    public readonly userId: string,
    public readonly target: {
      type: 'comment' | 'post';
      targetId: ObjectId;
    },
    public readonly likeStatus: LikeStatus,
  ) {}
}
