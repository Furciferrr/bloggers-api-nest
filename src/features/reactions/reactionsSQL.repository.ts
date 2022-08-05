import { ReactionDBType } from './types/index';
import { Injectable } from '@nestjs/common';
import { IReactionsRepository } from './interfaces';
import { UpdateReactionDto } from './dto/update-reaction.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class ReactionsSQLRepository implements IReactionsRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}
  async create(reaction: ReactionDBType): Promise<ReactionDBType> {
    return this.dataSource.query(`INSERT INTO reactions VALUES()`);
  }

  async update(id: string, reaction: UpdateReactionDto): Promise<boolean> {
    const result = await this.dataSource.query(
      `UPDATE reactions SET likeStatus = '${reaction.likeStatus}' WHERE id = '${id}'`,
    );
    return result.modifiedCount === 1;
  }
}
