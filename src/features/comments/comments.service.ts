import { Injectable } from '@nestjs/common';
import { getRandomNumber } from 'src/shared/utils';
import { ResponseType } from 'src/types';
import { UserViewType } from '../users/types';
import { CommentsRepository } from './comments.repository';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ICommentsService } from './interfaces';
import { CommentDBType, CommentView } from './types';

@Injectable()
export class CommentsService implements ICommentsService {
  constructor(private readonly commentsRepository: CommentsRepository) {}
  async create(
    postId: string,
    createCommentDto: CreateCommentDto,
    user: UserViewType,
  ): Promise<CommentDBType> {
    const newComment: CommentDBType = {
      id: getRandomNumber().toString(),
      content: createCommentDto.content,
      userId: user.id.toString(),
      userLogin: user.login,
      addedAt: new Date().toISOString(),
      postId,
    };
    this.commentsRepository.create(newComment);
    return newComment;
  }

  async findOne(id: string) {
    return this.commentsRepository.findOne(id);
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
    return {
      pagesCount: pagesCount,
      page: pageNumber || 1,
      pageSize: pageSize || 10,
      totalCount: totalCount,
      items: resultComments,
    };
  }
}
