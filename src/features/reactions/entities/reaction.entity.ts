import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Reaction {
  @PrimaryGeneratedColumn()
  id: string;
  @Column({ select: false })
  likeStatus: string;
  // @OneToMany(() => ArticleEntity, (article) => article.author)
  userId: string | null;
  @Column()
  addedAt: Date;
  @Column()
  target: string;
}
