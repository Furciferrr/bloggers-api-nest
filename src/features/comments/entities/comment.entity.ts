import { PostEntity } from '../../../features/posts/entities/post.entity';
import { CommentReactionEntity } from '../../../features/reactions/entities/reaction.entity';
import { UserEntity } from '../../../features/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('comments')
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  content: string;
  @ManyToOne(() => UserEntity, (user) => user.id, { eager: true })
  user: UserEntity;
  @CreateDateColumn({ type: 'timestamp' })
  addedAt: string;
  @ManyToOne(() => PostEntity, (post) => post.comments)
  post: PostEntity;
  @OneToMany(() => CommentReactionEntity, (comment) => comment.target)
  reactions: CommentReactionEntity[];
}
