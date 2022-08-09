import { PostEntity } from 'src/features/posts/entities/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('bloggers')
export class BloggerEntity {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  name: string;
  @Column()
  youtubeUrl: string;
  @OneToMany(() => PostEntity, (post) => post.blogger)
  posts: PostEntity[];
}
