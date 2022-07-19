import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentDocument, Comment } from './entities/comment.entity';
import { CommentDBType, CommentView } from './types';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class BloggerRepository {
  constructor(
    @InjectModel(Comment.name)
    private commentsCollection: Model<CommentDocument>,
  ) {}
  async getCommentById(id: string): Promise<CommentDBType | null> {
    const result = await this.commentsCollection
      .findOne({ id })
      .select(['-_id', '-__v'])
      .lean();
    return result;
  }

  async updateCommentById(
    id: string,
    commentDto: UpdateCommentDto,
  ): Promise<boolean> {
    const result = await this.commentsCollection.updateOne(
      { id },
      { $set: commentDto },
    );
    return result.modifiedCount === 1;
  }

  async deleteCommentById(id: string): Promise<boolean> {
    const result = await this.commentsCollection.deleteOne({ id });
    return result.deletedCount === 1;
  }

  async getCommentsByPostId(
    id: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<Array<CommentView>> {
    const result = await this.commentsCollection
      .find({ postId: id })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .select(['-_id', '-__v', '-postId'])
      .lean();
    return result;
  }

  async getTotalCount(postId: string): Promise<number> {
    return await this.commentsCollection.countDocuments({
      postId: postId,
    });
  }

  async createComment(comment: CommentDBType): Promise<CommentDBType> {
    this.commentsCollection.create(comment);
    return comment;
  }
}
