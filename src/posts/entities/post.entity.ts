import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PostDBType } from '../types';

export type PostDocument = PostDBType & Document;

@Schema()
export class Post {
  @Prop({ type: String, required: true })
  id: string;
  @Prop({ type: String, required: true })
  title: string;
  @Prop({ type: String, required: true })
  shortDescription: string;
  @Prop({ type: String, required: true })
  content: string;
  @Prop({ type: String, required: true })
  bloggerId: string;
  @Prop({ type: String, required: true })
  bloggerName: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
