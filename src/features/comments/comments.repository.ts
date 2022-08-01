import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentDocument, Comment } from './entities/comment.schema';
import { CommentDBType, CommentView } from './types';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ICommentsRepository } from './interfaces';

@Injectable()
export class CommentsRepository implements ICommentsRepository {
  constructor(
    @InjectModel(Comment.name)
    private commentsCollection: Model<CommentDocument>,
  ) {}
  async findOne(id: string): Promise<CommentDBType | null> {
    const result = await this.commentsCollection
      .findOne({ id })
      .select(['-_id', '-__v'])
      .lean();
    return result;
  }

  async update(id: string, commentDto: UpdateCommentDto): Promise<boolean> {
    const result = await this.commentsCollection.updateOne(
      { id },
      { $set: commentDto },
    );
    return result.modifiedCount === 1;
  }

  async remove(id: string): Promise<boolean> {
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

  async create(comment: CommentDBType): Promise<CommentDBType> {
    this.commentsCollection.create(comment);
    return comment;
  }
}
