import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
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
      .select(['-__v'])
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
  ): Promise<Array<CommentDBType>> {
    const result = await this.commentsCollection
      .find({ postId: id })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .select(['-__v'])
      .lean();
    return result;
  }

  async getTotalCount(postId: string): Promise<number> {
    return await this.commentsCollection.countDocuments({
      postId: postId,
    });
  }

  async create(comment: Omit<CommentDBType, '_id'>): Promise<Omit<CommentDBType, '_id'>> {
    this.commentsCollection.create(comment);
    return comment;
  }

  async updateReaction(id: string, objectId: ObjectId): Promise<boolean> {
    const result = await this.commentsCollection.updateOne(
      { id },
      { $addToSet: { reactions: objectId as any } },
    );
    return result.modifiedCount === 1;
  }

  async getCommentByIdWithObjectId(
    id: string,
  ): Promise<(CommentDBType & { _id: ObjectId }) | null> {
    return this.commentsCollection.findOne({ id }).select(['-__v']).lean();
  }
}
