import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from './entities/comment.entity';
import { CommentDBType } from './types';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ICommentsRepository } from './interfaces';

@Injectable()
export class CommentsSQLRepository implements ICommentsRepository {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentsRepository: Repository<CommentEntity>,
  ) {}

  async findOne(id: string): Promise<CommentDBType | null> {
    const result = await this.commentsRepository.query(`
      SELECT * FROM comments
      WHERE id = '${id}'
    `);
    if (!result.length) {
      return null;
    }
    return result[0];
  }

  async update(id: string, commentDto: UpdateCommentDto): Promise<boolean> {
    const updatedComment = await this.commentsRepository.query(`
      UPDATE comments SET ${Object.keys(commentDto)
        .map((key) => `"${key}" = '${commentDto[key]}'`)
        .join(', ')}
        WHERE id = '${id}'`);
    return updatedComment;
  }

  async remove(id: string): Promise<boolean> {
    const deletedPost = await this.commentsRepository.query(`
      DELETE FROM comments WHERE id = '${id}'
    `);
    return deletedPost[1] === 1;
  }

  async getCommentsByPostId(
    id: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<Array<CommentDBType>> {
    const conclusion = await this.commentsRepository.query(`
      SELECT * FROM comments
      WHERE postId = '${id}'
      ORDER BY id
      LIMIT ${pageSize}
      OFFSET ${(pageNumber - 1) * pageSize};`);
    return conclusion;
  }

  async getTotalCount(postId: string): Promise<number> {
    const result = await this.commentsRepository.query(`
      SELECT COUNT(*) FROM comments WHERE postId = '${postId}'
    `);
    return result[0].count;
  }

  async create(
    comment: Omit<CommentDBType, '_id'>,
  ): Promise<Omit<CommentDBType, '_id'>> {
    const result = await this.commentsRepository.query(`
    INSERT INTO comments ("content", "userId", "postId")  
    VALUES ('${comment.content}', '${comment.userId}', '${comment.postId}') Returning *;`);
    return result[0];
  }

  async updateReaction(id: string, targetId: string): Promise<boolean> {
    return true;
  }

  async deleteAllComments(): Promise<any> {
    return await this.commentsRepository.query(`DELETE FROM comments`);
  }
}
