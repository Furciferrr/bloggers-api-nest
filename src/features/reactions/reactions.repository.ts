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
    return this.reactionsCollection.create(reaction);
  }

  async update(id: string, reaction: UpdateReactionDto): Promise<boolean> {
    const result = await this.reactionsCollection.updateOne(
      { id },
      { $set: reaction },
    );
    return result.modifiedCount === 1;
  }

  async likesCountByPostId(postId: string): Promise<number> {
    return await this.reactionsCollection.countDocuments({
      postId,
      likeStatus: LikeStatus.Like,
    });
  }

  async dislikesCountByPostId(postId: string): Promise<number> {
    return await this.reactionsCollection.countDocuments({
      postId,
      likeStatus: LikeStatus.Dislike,
    });
  }

  async getNewestReactionsByPostId(
    postId: string,
    limit: number,
  ): Promise<ReactionDBType[]> {
    return this.reactionsCollection
      .find({ postId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select(['-_id', '-__v'])
      .lean();
  }

  async getReactionByUserIdAndPostId(
    userId: string,
    postObjectId: ObjectId,
  ): Promise<ReactionDBType | null> {
    return this.reactionsCollection
      .findOne({
        userId,
        'target..type.type': 'post',
        'target.targetId': postObjectId,
      })
      .select(['-_id', '-__v'])
      .lean();
  }
}
