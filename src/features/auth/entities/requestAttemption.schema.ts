import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

interface RequestAttemptType {
  ip: string;
  date: Date;
  path: string;
}

export type RequestAttemptDocument = RequestAttemptType & Document;

@Schema()
export class RequestAttempt {
  @Prop({ type: String, required: true })
  ip: string;
  @Prop({ type: String, required: true })
  path: string;
  @Prop({ type: Date, required: true })
  date: Date;
}

export const RequestAttemptSchema =
  SchemaFactory.createForClass(RequestAttempt);
