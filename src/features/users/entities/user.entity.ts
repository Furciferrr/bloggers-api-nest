import { CommentEntity } from 'src/features/comments/entities/comment.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ConfirmationEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  confirmationCode: string;
  @Column()
  expirationDate: Date;
  @Column()
  isConfirmed: boolean;
}

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  login: string;
  @Column()
  hashPassword: string;
  @OneToOne(() => ConfirmationEntity)
  @JoinColumn()
  confirmation: ConfirmationEntity;
  @Column()
  email: string;
  @Column()
  tokenVersion: number;
  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments: CommentEntity[];
}
