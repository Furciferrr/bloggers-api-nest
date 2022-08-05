import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Reaction } from 'src/features/reactions/entities/reaction.schema';
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
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Reaction' })
  reactions: Reaction[];
  @Prop({ type: Date, required: true })
  addedAt: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
