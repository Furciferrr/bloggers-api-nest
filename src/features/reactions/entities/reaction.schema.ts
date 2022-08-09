import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { LikeStatus, ReactionDBType } from '../types';

export type ReactionDocument = ReactionDBType & Document;

@Schema()
class Target {
  @Prop({ type: String, required: true })
  type: 'comment' | 'post';
  @Prop({ type: String, required: true })
  targetId: string;
}

@Schema()
export class Reaction {
  @Prop({ type: String, required: true })
  id: string;
  @Prop({ type: String, required: true })
  likeStatus: LikeStatus;
  @Prop({ type: String, required: true })
  userId: string | null;
  @Prop({ type: Date, required: true })
  addedAt: Date;
  @Prop({ type: Target })
  target: Target;
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);
