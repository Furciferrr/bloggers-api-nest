import { BloggerEntity } from '../../../features/bloggers/entities/blogger.entity';
import { CommentEntity } from '../../../features/comments/entities/comment.entity';
import { PostReactionEntity } from '../../../features/reactions/entities/reaction.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('posts')
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  title: string;
  @Column()
  shortDescription: string;
  @Column()
  content: string;
  @ManyToOne(() => BloggerEntity, (blogger) => blogger.posts, {
    eager: true,
    onDelete: 'CASCADE',
  })
  blogger: BloggerEntity;
  @CreateDateColumn({ type: 'timestamp' })
  addedAt: Date;
  @OneToMany(() => CommentEntity, (comment) => comment.post, {
    onDelete: 'CASCADE',
  })
  comments: CommentEntity[];
  @OneToMany(() => PostReactionEntity, (reaction) => reaction.target, {
    onDelete: 'CASCADE',
  })
  reactions: PostReactionEntity[];
}
