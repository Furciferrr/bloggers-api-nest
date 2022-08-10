import { BloggerEntity } from 'src/features/bloggers/entities/blogger.entity';
import { CommentEntity } from 'src/features/comments/entities/comment.entity';
import { PostReactionEntity } from 'src/features/reactions/entities/reaction.entity';
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
  @OneToMany(() => CommentEntity, (comment) => comment.post)
  comments: CommentEntity[];
  @OneToMany(() => PostReactionEntity, (comment) => comment.target)
  reactions: PostReactionEntity[];
}
