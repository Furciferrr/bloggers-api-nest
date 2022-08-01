import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { getRandomNumber } from 'src/shared/utils';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { UpdateReactionDto } from './dto/update-reaction.dto';
import { ReactionsRepository } from './reactions.repository';
import { ReactionViewType } from './types';

@Injectable()
export class ReactionsService {
  constructor(private readonly reactionRepository: ReactionsRepository) {}
  async create(createReactionDto: CreateReactionDto) {
    const reaction = {
      ...createReactionDto,
      id: getRandomNumber().toString(),
      addedAt: new Date(),
    };
    return this.reactionRepository.create(reaction as any);
  }

  findAll() {
    return `This action returns all reactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reaction`;
  }

  async update(id: string, updateReactionDto: UpdateReactionDto) {
    return await this.reactionRepository.update(id, updateReactionDto);
  }

  remove(id: number) {
    return `This action removes a #${id} reaction`;
  }

  async likesCountByPostId(postId: string): Promise<number> {
    return await this.reactionRepository.likesCountByPostId(postId);
  }

  async dislikesCountByPostId(postId: string): Promise<number> {
    return await this.reactionRepository.dislikesCountByPostId(postId);
  }

  async getNewestReactionsByPostId(
    postId: string,
    limit: number,
  ): Promise<ReactionViewType[]> {
    const reactions = await this.reactionRepository.getNewestReactionsByPostId(
      postId,
      limit,
    );

    return reactions.map((reaction) => {
      const { target, ...rest } = reaction;
      return rest;
    });
  }

  async getReactionByUserIdAndPostId(
    userId: string,
    postObjectId: ObjectId,
  ): Promise<ReactionViewType | null> {
    const reaction = await this.reactionRepository.getReactionByUserIdAndPostId(
      userId,
      postObjectId,
    );
    //const { target, ...rest } = reaction;
    return reaction;
  }
}
