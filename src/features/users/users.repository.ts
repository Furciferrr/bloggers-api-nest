import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserRepository } from './interfaces/index';
import { UserDocument, User } from './entities/user.schema';
import { UserDBType, UserViewType } from './types';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async getUsers(pageNumber = 1, pageSize = 10): Promise<UserViewType[]> {
    return this.userModel
      .find({ 'emailConfirmation.isConfirmed': true })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .select(['-_id', '-hashPassword', '-__v', '-emailConfirmation']);
  }

  async getTotalCount(): Promise<number> {
    return await this.userModel.countDocuments();
  }

  async getUserByLogin(login: string): Promise<UserDBType | null> {
    const user: UserDBType | null = await this.userModel
      .findOne({ login })
      .select(['-_id', '-__v']);
    if (!user) {
      return null;
    }
    return user;
  }

  async getUserByLoginOrEmail(
    login: string,
    email: string,
  ): Promise<UserDBType | null> {
    const user: UserDBType | null = await this.userModel
      .findOne({ $or: [{ login: login }, { email: email }] })
      .select(['-_id', '-__v']);
    if (!user) {
      return null;
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<UserDBType | null> {
    const user: UserDBType | null = await this.userModel
      .findOne({ email })
      .select(['-_id', '-__v']);
    if (!user) {
      return null;
    }
    return user;
  }

  async updateUserById(
    user: Partial<UserDBType> & { id: string },
  ): Promise<boolean> {
    const { id } = user;
    const updatedUser = await this.userModel.updateOne({ id }, { $set: user });
    return updatedUser.modifiedCount === 1;
  }

  async getUserByConfirmationCode(
    confirmationCode: string,
  ): Promise<UserDBType | null> {
    const user: UserDBType | null = await this.userModel
      .findOne({ 'emailConfirmation.confirmationCode': confirmationCode })
      .select(['-_id', '-__v']);
    if (!user) {
      return null;
    }
    return user;
  }

  async getUserById(id: string): Promise<UserDBType | null> {
    const user: UserDBType | null = await this.userModel
      .findOne({ id })
      .select(['-_id', '-__v']);
    if (!user) {
      return null;
    }
    return user;
  }

  async deleteUserById(id: string): Promise<boolean> {
    const result = await this.userModel.deleteOne({ id });
    return result.deletedCount === 1;
  }

  async createUser(user: UserDBType): Promise<UserDBType> {
    await this.userModel.create(user);
    return user;
  }

  async deleteAllUsers(): Promise<any> {
    const result = await this.userModel.remove({});
    return result;
  }
}
