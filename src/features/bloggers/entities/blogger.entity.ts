import { PostEntity } from '../../../features/posts/entities/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('bloggers')
export class BloggerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  youtubeUrl: string;
  @OneToMany(() => PostEntity, (post) => post.blogger)
  posts: PostEntity[];
}
