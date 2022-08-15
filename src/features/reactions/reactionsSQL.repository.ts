import { LikeStatus, ReactionDBType } from './types/index';
import { Injectable } from '@nestjs/common';
import { IReactionsRepository } from './interfaces';
import { UpdateReactionDto } from './dto/update-reaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CommentReactionEntity,
  PostReactionEntity,
} from './entities/reaction.entity';

@Injectable()
export class ReactionsSQLRepository implements IReactionsRepository {
  constructor(
    @InjectRepository(PostReactionEntity)
    private readonly postsReactionsRepository: Repository<PostReactionEntity>,
    @InjectRepository(CommentReactionEntity)
    private readonly commentsReactionsRepository: Repository<CommentReactionEntity>,
  ) {}

  async create(reaction: ReactionDBType): Promise<ReactionDBType> {
    let reactionEntity: any;
    if (reaction.target.type === 'post') {
      reactionEntity = await this.postsReactionsRepository.query(`
        INSERT INTO "postsReactions" (
          "likeStatus",
          "userId",
          "targetId"
          ) VALUES (
            '${reaction.likeStatus}',
            '${reaction.userId}',
            '${reaction.target.targetId}'
            ) Returning *;
            `);
    } else if (reaction.target.type === 'comment') {
      reactionEntity = await this.commentsReactionsRepository.query(`
        INSERT INTO "commentsReactions" (
          "likeStatus",
          "userId",
          "targetId"
          ) VALUES (
            '${reaction.likeStatus}',
            '${reaction.userId}',
            '${reaction.target.targetId}'
            ) Returning *;
            `);
    }
    return reactionEntity;
  }

  async update(id: string, reaction: UpdateReactionDto): Promise<boolean> {
    const postResult = await this.postsReactionsRepository.query(`
      UPDATE "postsReactions"
      SET "likeStatus" = '${reaction.likeStatus}'
      WHERE "id" = '${id}'
    `);

    const commentResult = await this.postsReactionsRepository.query(`
      UPDATE "postsReactions"
      SET "likeStatus" = '${reaction.likeStatus}'
      WHERE "id" = '${id}'
    `);
    return postResult || commentResult;
  }

  async likesCountByTargetId(
    targetId: string,
    type: 'post' | 'comment',
  ): Promise<number> {
    let result: [{ count: number }] | [] = [];
    if (type === 'post') {
      result = await this.postsReactionsRepository.query(`
        SELECT COUNT(*) FROM "postsReactions" 
        WHERE "targetId" = '${targetId}' AND "likeStatus" = '${LikeStatus.Like}';
      `);
    } else if (type === 'comment') {
      result = await this.commentsReactionsRepository.query(`
      SELECT COUNT(*) FROM "postsReactions" 
      WHERE "targetId" = '${targetId}' AND "likeStatus" = '${LikeStatus.Like}';
      `);
    }
    return +result[0].count;
  }

  async dislikesCountByTargetId(
    targetId: string,
    type: 'post' | 'comment',
  ): Promise<number> {
    let result: [{ count: number }] | [] = [];
    if (type === 'post') {
      result = await this.postsReactionsRepository.query(`
        SELECT COUNT(*) FROM "postsReactions" 
        WHERE "targetId" = '${targetId}' AND "likeStatus" = '${LikeStatus.Dislike}';
      `);
    } else if (type === 'comment') {
      result = await this.commentsReactionsRepository.query(`
      SELECT COUNT(*) FROM "postsReactions" 
      WHERE "targetId" = '${targetId}' AND "likeStatus" = '${LikeStatus.Dislike}';
      `);
    }
    return +result[0].count;
  }

  async getNewestReactionsByTargetId(
    targetId: string,
    limit: number,
    type: 'post' | 'comment',
  ): Promise<ReactionDBType[]> {
    let result: ReactionDBType[] = [];
    if (type === 'post') {
      result = await this.postsReactionsRepository.query(`
        SELECT * FROM "postsReactions" 
        WHERE "targetId" = '${targetId}' AND "likeStatus" = 'Like' 
        ORDER BY "addedAt" DESC 
        LIMIT ${limit};
      `);
    } else if (type === 'comment') {
      result = await this.commentsReactionsRepository.query(`
        SELECT * FROM "commentsReactions" 
        WHERE "targetId" = '${targetId}' AND "likeStatus" = 'Like' 
        ORDER BY "addedAt" DESC 
        LIMIT ${limit};
      `);
    }
    return result;
  }

  async getReactionByUserIdAndTargetId(
    targetId: string,
    type: 'post' | 'comment',
    userId: string,
  ): Promise<ReactionDBType | null> {
    let result: ReactionDBType[] | null = null;
    if (type === 'post') {
      result = await this.postsReactionsRepository.query(`
        SELECT * FROM "postsReactions"
        WHERE "targetId" = '${targetId}' AND "userId" = '${userId}';
      `);
    } else if (type === 'comment') {
      result = await this.commentsReactionsRepository.query(`
        SELECT * FROM "commentsReactions"
        WHERE "targetId" = '${targetId}' AND "userId" = '${userId}';
      `);
    }
    return result[0] || null;
  }

  async deleteAllReactions(): Promise<any> {
    return await this.postsReactionsRepository.query(`
      BEGIN; 
      DELETE FROM commentsReactions
      DELETE FROM postsReactions
      COMMIT;
    `);
  }
}
