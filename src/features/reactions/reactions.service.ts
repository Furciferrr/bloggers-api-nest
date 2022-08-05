import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ObjectId } from 'mongoose';
import { getRandomNumber } from 'src/shared/utils';
import { CreateReactionCommand } from './commands/create-reaction.command';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { UpdateReactionDto } from './dto/update-reaction.dto';
import { ReactionsRepository } from './reactions.repository';
import { ReactionViewType } from './types';

@Injectable()
export class ReactionsService {
  constructor(
    private readonly reactionRepository: ReactionsRepository,
    private commandBus: CommandBus,
  ) {}
  async create(createReactionDto: CreateReactionDto) {
    const reaction = {
      ...createReactionDto,
      id: getRandomNumber().toString(),
      addedAt: new Date(),
    };
    return this.reactionRepository.create(reaction as any);
  }

  async createCommandUseCase(createReactionDto: CreateReactionDto) {
    return this.commandBus.execute(
      new CreateReactionCommand(
        createReactionDto.userId,
        createReactionDto.target.type,
        createReactionDto.likeStatus,
      ),
    );
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

  async likesCountByTargetId(
    postId: ObjectId,
    type: 'post' | 'comment',
  ): Promise<number> {
    return await this.reactionRepository.likesCountByTargetId(postId, type);
  }

  async dislikesCountByTargetId(
    postId: ObjectId,
    type: 'post' | 'comment',
  ): Promise<number> {
    return await this.reactionRepository.dislikesCountByTargetId(postId, type);
  }

  async getNewestReactionsByTargetId(
    postId: ObjectId,
    limit: number,
    type: 'post' | 'comment',
  ): Promise<Omit<ReactionViewType, 'id'>[]> {
    const reactions =
      await this.reactionRepository.getNewestReactionsByTargetId(
        postId,
        limit,
        type,
      );

    return reactions.map((reaction) => {
      const { target, id, ...rest } = reaction;
      return rest;
    });
  }

  async getReactionByUserIdAndTargetId(
    postObjectId: ObjectId,
    type: 'post' | 'comment',
    userId?: string,
  ): Promise<ReactionViewType | null> {
    const reaction =
      await this.reactionRepository.getReactionByUserIdAndTargetId(
        userId,
        postObjectId,
        type,
      );

    //const { target, ...rest } = reaction;
    return reaction;
  }
}