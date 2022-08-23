import { CommentEntity } from '../../../features/comments/entities/comment.entity';
import { PostEntity } from '../../../features/posts/entities/post.entity';
import { UserEntity } from '../../../features/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('postsReactions')
export class PostReactionEntity {
  @PrimaryGeneratedColumn()
  id: string;
  @Column({ select: false })
  likeStatus: string;
  @ManyToOne(() => UserEntity, (user) => user.id, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: UserEntity;
  @CreateDateColumn({ type: 'timestamp' })
  addedAt: Date;
  @ManyToOne(() => PostEntity, (post) => post.reactions, {
    onDelete: 'CASCADE',
  })
  target: PostEntity;
}

@Entity('commentsReactions')
export class CommentReactionEntity {
  @PrimaryGeneratedColumn()
  id: string;
  @Column({ select: false })
  likeStatus: string;
  @ManyToOne(() => UserEntity, (user) => user.id, {
    eager: true,
    onDelete: 'CASCADE',
  })
  user: UserEntity;
  @CreateDateColumn({ type: 'timestamp' })
  addedAt: Date;
  @ManyToOne(() => CommentEntity, (comment) => comment.reactions, {
    onDelete: 'CASCADE',
  })
  target: CommentEntity;
}

type GameStatus = 'PendingSecondPlayer' | 'InProgress' | 'Finished';

@Entity('games')
class GameEntity {
  @PrimaryGeneratedColumn()
  id: string;
  status: GameStatus;
  pairCreatedDate: Date;
  startGameDate: Date;
  finishGameDate: Date;
}

@Entity('players')
class GamePlayerEntity {
  @PrimaryGeneratedColumn()
  id: string;
  @ManyToOne(() => UserEntity, (user) => user.id)
  user: UserEntity;
  @Column({ select: false })
  score: number;
}

@Entity('answers')
class AnswerEntity {
  @PrimaryGeneratedColumn()
  id: string;
  @OneToMany(() => GameEntity, (game) => game.id)
  game: GameEntity[];
  @ManyToOne(() => GamePlayerEntity, (player) => player.id)
  playerId: string;
  questionId: string;
  answer: string;
  answerStatus: boolean;
  addedAt: Date;
}

@Entity('questions')
class QuestionEntity {
  id: string;
  question: string;
  answers: AnswerEntity[];
}
