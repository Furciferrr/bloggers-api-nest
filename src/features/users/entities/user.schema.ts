import { UserDBType } from '../types';
import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document } from 'mongoose';

/* export const UserScheme = new mongoose.Schema<UserDBType>({
  id: { type: String, required: true },
  login: { type: String, required: true },
  hashPassword: { type: String, required: true },
  emailConfirmation: {
    confirmationCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    isConfirmed: { type: Boolean, required: true },
  },
  tokenVersion: { type: Number, required: true },
  email: { type: String, required: true },
}); */

export type UserDocument = UserDBType & Document;

@Schema()
export class User {
  @Prop({ type: String, required: true })
  id: string;
  @Prop({ type: String, required: true })
  login: string;
  @Prop({ type: String, required: true })
  hashPassword: string;
  @Prop(
    raw({
      confirmationCode: { type: String },
      expirationDate: { type: Date },
      isConfirmed: { type: Boolean },
    }),
  )
  emailConfirmation: {
    confirmationCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
  };
  @Prop({ type: Number, required: true })
  tokenVersion: number;
  @Prop({ type: String, required: true })
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
