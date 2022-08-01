import { UserViewType } from 'src/features/users/types';
import { ResponseType } from 'src/types';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { CommentDBType, CommentView } from '../types';

export interface ICommentsService {
  findOne(id: string): Promise<CommentDBType | null>;
  update(id: string, commentDto: UpdateCommentDto): Promise<boolean>;
  remove(id: string): Promise<boolean>;
  getCommentsByPostId(
    id: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<ResponseType<CommentView>>;
  create(
    postId: string,
    commentDto: CreateCommentDto,
    user: UserViewType,
  ): Promise<CommentDBType>;
}

export interface ICommentsRepository {
  findOne(id: string): Promise<CommentDBType | null>;
  update(id: string, commentDto: UpdateCommentDto): Promise<boolean>;
  remove(id: string): Promise<boolean>;
  getCommentsByPostId(
    id: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<Array<CommentView>>;
  create(comment: CommentDBType): Promise<CommentDBType>;
  getTotalCount(postId: string): Promise<number>;
}
