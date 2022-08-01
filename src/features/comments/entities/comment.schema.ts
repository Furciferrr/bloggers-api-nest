import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CommentDBType } from '../types';

export type CommentDocument = CommentDBType & Document;

@Schema()
export class Comment {
  @Prop({ type: String, required: true })
  id: string;
  @Prop({ type: String, required: true })
  content: string;
  @Prop({ type: String, required: true })
  userId: string;
  @Prop({ type: String, required: true })
  userLogin: string;
  @Prop({ type: String, required: true })
  addedAt: string;
  @Prop({ type: String, required: true })
  postId: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
