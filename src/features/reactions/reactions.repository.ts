import { LikeStatus, ReactionDBType } from './types/index';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Reaction, ReactionDocument } from './entities/reaction.schema';
import { Model, ObjectId } from 'mongoose';
import { IReactionsRepository } from './interfaces';
import { UpdateReactionDto } from './dto/update-reaction.dto';

@Injectable()
export class ReactionsRepository implements IReactionsRepository {
  constructor(
    @InjectModel(Reaction.name)
    private reactionsCollection: Model<ReactionDocument>,
  ) {}
  async create(reaction: ReactionDBType): Promise<ReactionDBType> {
    return this.reactionsCollection.create({
      ...reaction,
      target: {
        type: {
          ...reaction.target,
        },
      },
    });
  }

  async update(id: string, reaction: UpdateReactionDto): Promise<boolean> {
    const result = await this.reactionsCollection.updateOne(
      { id },
      { $set: reaction },
    );
    return result.modifiedCount === 1;
  }

  async likesCountByTargetId(
    postId: ObjectId,
    type: 'post' | 'comment',
  ): Promise<number> {
    return await this.reactionsCollection.countDocuments({
      'target.type.targetId': postId,
      'target.type.type': type,
      likeStatus: LikeStatus.Like,
    });
  }

  async dislikesCountByTargetId(
    postId: ObjectId,
    type: 'post' | 'comment',
  ): Promise<number> {
    return await this.reactionsCollection.countDocuments({
      'target.type.targetId': postId,
      'target.type.type': type,
      likeStatus: LikeStatus.Dislike,
    });
  }

  async getNewestReactionsByTargetId(
    targetId: ObjectId,
    limit: number,
    type: 'post' | 'comment',
  ): Promise<ReactionDBType[]> {
    return this.reactionsCollection
      .find({ 'target.type.type': type, 'target.type.targetId': targetId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select(['-_id', '-__v'])
      .lean();
  }

  async getReactionByUserIdAndTargetId(
    userId: string,
    postObjectId: ObjectId,
    type: 'post' | 'comment',
  ): Promise<ReactionDBType | null> {
    return this.reactionsCollection
      .findOne({
        userId,
        'target.type.type': type,
        'target.type.targetId': postObjectId,
      })
      .select(['-_id', '-__v'])
      .lean();
  }
}