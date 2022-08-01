import { ReactionDBType } from '../types';

export interface IReactionsRepository {
  create(reaction: ReactionDBType): Promise<ReactionDBType>;
}
