import { LikeStatus } from '../types';

export class CreateReactionCommand {
  constructor(
    public readonly userId: string,
    public readonly target: {
      type: 'comment' | 'post';
      targetId: string;
    },
    public readonly likeStatus: LikeStatus,
  ) {}
}
