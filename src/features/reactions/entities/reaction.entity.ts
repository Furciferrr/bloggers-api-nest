import { CommentEntity } from 'src/features/comments/entities/comment.entity';
import { PostEntity } from 'src/features/posts/entities/post.entity';
import { UserEntity } from 'src/features/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('postsReactions')
export class PostReactionEntity {
  @PrimaryGeneratedColumn()
  id: string;
  @Column({ select: false })
  likeStatus: string;
  @ManyToOne(() => UserEntity, (user) => user.id, { eager: true })
  user: UserEntity;
  @CreateDateColumn({ type: 'timestamp' })
  addedAt: Date;
  @ManyToOne(() => PostEntity, (post) => post.reactions)
  target: PostEntity;
}

@Entity('commentsReactions')
export class CommentReactionEntity {
  @PrimaryGeneratedColumn()
  id: string;
  @Column({ select: false })
  likeStatus: string;
  @ManyToOne(() => UserEntity, (user) => user.id, { eager: true })
  user: UserEntity;
  @CreateDateColumn({ type: 'timestamp' })
  addedAt: Date;
  @ManyToOne(() => CommentEntity, (comment) => comment.reactions)
  target: CommentEntity;
}
