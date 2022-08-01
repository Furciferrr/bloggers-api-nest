import { IsIn } from 'class-validator';
import { LikeStatus } from 'src/features/reactions/types';

export class UpdateLikeStatusDto {
  @IsIn(['None', 'Like', 'Dislike'], {
    message: 'likeStatus field is required',
  })
  readonly likeStatus: LikeStatus;
}
