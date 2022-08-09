import { LikeStatus } from 'src/features/reactions/types';
import { Injectable } from '@nestjs/common';
import { getRandomNumber } from 'src/shared/utils';
import { ResponseType } from 'src/types';
import { UpdateLikeStatusDto } from '../posts/dto/update-likeStatus.dto';
import { ReactionsService } from '../reactions/reactions.service';
import { UserViewType } from '../users/types';
import { CommentsRepository } from './comments.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ICommentsService } from './interfaces';
import { CommentDBType, CommentView } from './types';

@Injectable()
export class CommentsService implements ICommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly reactionService: ReactionsService,
  ) {}
  async create(
    postId: string,
    createCommentDto: CreateCommentDto,
    user: UserViewType,
  ): Promise<CommentView> {
    const newComment: Omit<CommentDBType, '_id'> = {
      id: getRandomNumber().toString(),
      content: createCommentDto.content,
      userId: user.id.toString(),
      userLogin: user.login,
      addedAt: new Date().toISOString(),
      postId,
    };
    this.commentsRepository.create(newComment);
    delete newComment.postId;
    const withReactions = Object.assign(newComment, {
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: LikeStatus.None,
      },
    });
    return withReactions;
  }

  async findOne(id: string, user?: UserViewType): Promise<CommentView | null> {
    const comment = await this.commentsRepository.findOne(id);
    if (!comment) {
      return null;
    }
    const likesInfo = await this.buildLikesInfo(comment.id, user?.id);
    delete comment._id;
    delete comment.postId;
    const withReactions = Object.assign(comment, {
      likesInfo,
    });

    return withReactions;
  }

  async buildLikesInfo(
    commentId: string,
    userId?: string,
  ): Promise<{
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
  }> {
    const likesCount = await this.reactionService.likesCountByTargetId(
      commentId,
      'comment',
    );
    const dislikesCount = await this.reactionService.dislikesCountByTargetId(
      commentId,
      'comment',
    );
    const myStatus = await this.reactionService.getReactionByUserIdAndTargetId(
      commentId,
      'comment',
      userId,
    );

    return {
      likesCount,
      dislikesCount,
      myStatus: myStatus?.likeStatus || LikeStatus.None,
    };
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<boolean> {
    return await this.commentsRepository.update(id, updateCommentDto);
  }

  async remove(id: string): Promise<boolean> {
    return await this.commentsRepository.remove(id);
  }

  async getCommentsByPostId(
    id: string,
    pageNumber = 1,
    pageSize = 10,
  ): Promise<ResponseType<CommentView>> {
    const resultComments = await this.commentsRepository.getCommentsByPostId(
      id,
      pageNumber || 1,
      pageSize || 10,
    );
    const totalCount = await this.commentsRepository.getTotalCount(id);
    const pagesCount = Math.ceil(totalCount / (pageSize || 10));

    const commentsViewPromises = resultComments.map(async (comment) => {
      const likesInfo = await this.buildLikesInfo(comment.id);
      const { _id, ...rest } = comment;
      return { ...rest, likesInfo };
    });
    const commentsView = await Promise.all(commentsViewPromises);

    return {
      pagesCount: pagesCount,
      page: pageNumber || 1,
      pageSize: pageSize || 10,
      totalCount: totalCount,
      items: commentsView,
    };
  }

  async updateLikeStatus(
    id: string,
    updateLikeStatusDto: UpdateLikeStatusDto,
    userId: string,
  ): Promise<any> {
    const comment = await this.commentsRepository.getCommentByIdWithObjectId(
      id,
    );

    if (!comment) {
      return false;
    }
    const userReaction =
      await this.reactionService.getReactionByUserIdAndTargetId(
        comment.id,
        'comment',
        userId,
      );

    if (userReaction) {
      const result = await this.reactionService.update(userReaction.id, {
        likeStatus: updateLikeStatusDto.likeStatus,
      });
      return result;
    } else {
      const result = await this.reactionService.createCommandUseCase({
        likeStatus: updateLikeStatusDto.likeStatus,
        userId,
        target: {
          type: {
            type: 'comment',
            targetId: comment.id,
          },
        },
      });
      if (!result) {
        return false;
      }

      this.commentsRepository.updateReaction(id, result._id);

      return result;
    }
  }
}
