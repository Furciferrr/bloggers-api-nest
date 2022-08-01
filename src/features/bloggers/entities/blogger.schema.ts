import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BloggerDBType } from '../types';

export type BloggerDocument = BloggerDBType & Document;

@Schema()
export class Blogger {
  @Prop({ type: String, required: true })
  id: string;
  @Prop({ type: String, required: true })
  name: string;
  @Prop({ type: String, required: true })
  youtubeUrl: string;
}

export const BloggerSchema = SchemaFactory.createForClass(Blogger);
