import { IsIn } from 'class-validator';
import { LikeStatus } from '../../../features/reactions/types';

export class UpdateLikeStatusDto {
  @IsIn(['None', 'Like', 'Dislike'], {
    message: 'likeStatus field is required',
  })
  readonly likeStatus: LikeStatus;
}
