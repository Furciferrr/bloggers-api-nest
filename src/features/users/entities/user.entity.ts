import { CommentEntity } from '../../../features/comments/entities/comment.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('confirmations')
export class ConfirmationEntity {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  confirmationCode: string;
  @Column()
  expirationDate: Date;
  @Column()
  isConfirmed: boolean;
}

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  login: string;
  @Column()
  hashPassword: string;
  @Column()
  email: string;
  @Column()
  tokenVersion: number;
  @OneToOne(() => ConfirmationEntity)
  @JoinColumn()
  confirmation: ConfirmationEntity;
  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments: CommentEntity[];
}
