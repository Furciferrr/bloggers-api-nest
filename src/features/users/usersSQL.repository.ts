import { Injectable } from '@nestjs/common';
import { IUserRepository } from './interfaces/index';
import { UserDBType, UserViewType } from './types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserSQLRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(user: UserDBType): Promise<any> {
    const newUser = new UserEntity();
    Object.assign(newUser, user);
    await this.userRepository.save(newUser);
    return newUser;
  }
}
