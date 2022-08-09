import { ErrorType, ResponseType, ServiceResponseType } from '../../types';
import { Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add';
import { UserDBType, UserViewType } from './types';
import { CreateUserDto } from './dto/createUser.dto';
import { getRandomNumber } from 'src/shared/utils';
import { UserRepository } from './users.repository';
import { ConfigService } from '@nestjs/config';
import { IUserService } from './interfaces';

@Injectable()
export class UsersService implements IUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {}

  async getUsers(
    pageNumber?: number,
    pageSize?: number,
  ): Promise<ResponseType<UserViewType>> {
    const users = await this.userRepository.getUsers(
      pageNumber || 1,
      pageSize || 10,
    );
    const totalCount = await this.userRepository.getTotalCount();
    const pagesCount = Math.ceil(totalCount / (pageSize || 10));
    const buildResponse = {
      pagesCount,
      page: pageNumber || 1,
      pageSize: pageSize || 10,
      totalCount,
      items: users,
    };
    return buildResponse;
  }

  async deleteUserById(id: string): Promise<boolean> {
    return await this.userRepository.deleteUserById(id);
  }

  async getUserById(id: string): Promise<UserViewType | null> {
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      return null;
    }
    return {
      login: user.login,
      id: user.id,
    };
  }

  async getManyUsers(ids: string[]): Promise<UserViewType[]> {
    const users = await this.userRepository.getManyUsersByIds(ids);
    return users;
  }

  async getUserByLoginOrEmail(
    login: string,
    email: string,
  ): Promise<UserViewType | null> {
    const user = await this.userRepository.getUserByLoginOrEmail(login, email);
    if (!user) {
      return null;
    }
    return {
      login: user.login,
      id: user.id,
    };
  }

  async createUser(
    user: CreateUserDto,
  ): Promise<
    | ({ result: UserDBType } & { resultCode: 0 })
    | (ErrorType & { resultCode: 1 })
  > {
    const isEmailExist = await this.userRepository.getUserByEmail(user.email);
    const isLoginExist = await this.userRepository.getUserByLogin(user.login);

    if (isEmailExist) {
      return {
        errorsMessages: [
          {
            message: 'Email already exist',
            field: 'email',
          },
        ],
        resultCode: 1,
      };
    }
    if (isLoginExist) {
      return {
        errorsMessages: [
          {
            message: 'Login already exist',
            field: 'login',
          },
        ],
        resultCode: 1,
      };
    }
    const hashPassword = await this._generateHash(user.password);
    const nowDate = add(new Date(), { hours: 1, minutes: 2 });
    const newUser = {
      id: getRandomNumber().toString(),
      login: user.login,
      email: user.email,
      hashPassword,
      emailConfirmation: {
        confirmationCode: uuidv4(),
        expirationDate: nowDate,
        isConfirmed: true,
      },
      tokenVersion: 1,
    };
    const result = await this.userRepository.createUser(newUser);

    return { result, resultCode: 0 };
  }

  async confirmEmail(code: string): Promise<boolean> {
    const user = await this.userRepository.getUserByConfirmationCode(code);
    if (!user) {
      return false;
    }
    if (user.emailConfirmation.isConfirmed) {
      return false;
    }

    if (user.emailConfirmation?.expirationDate > new Date()) {
      const result = await this.userRepository.updateUserById({
        id: user.id,
        emailConfirmation: {
          confirmationCode: code,
          isConfirmed: true,
          expirationDate: user.emailConfirmation.expirationDate,
        },
      });
      return result;
    } else {
      return false;
    }
  }

  async checkCredentials(
    login: string,
    password: string,
  ): Promise<ServiceResponseType> {
    const user = await this.userRepository.getUserByLogin(login);
    if (!user) {
      return {
        resultCode: 1,
        data: {},
      };
    }
    if (!user.emailConfirmation.isConfirmed) {
      return {
        resultCode: 1,
        data: {},
      };
    }
    const resultCompare = await bcrypt.compare(password, user.hashPassword);
    const accessToken = this.generateJwt(
      user,
      this.configService.get<string>('JWT_EXPIRATION'),
    );
    const refreshToken = this.generateJwt(
      user,
      this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
      user.tokenVersion,
    );
    return {
      resultCode: resultCompare ? 0 : 1,
      data: {
        accessToken: resultCompare ? accessToken : null,
        refreshToken: resultCompare ? refreshToken : null,
      },
    };
  }

  async deleteAllUsers() {
    const checkResult = await this.userRepository.deleteAllUsers();
    return checkResult;
  }

  async updateUser(
    user: Partial<UserDBType> & { id: string },
  ): Promise<boolean> {
    const checkResult = await this.userRepository.updateUserById(user);
    return checkResult;
  }

  generateJwt(user: any, expiresIn?: string, tkv?: number): string {
    return sign(
      {
        id: user.id,
        tkv: tkv || 0,
      },
      this.configService.get<string>('JWT_SECRET'),
      {
        expiresIn:
          expiresIn || this.configService.get<string>('JWT_EXPIRATION'),
      },
    );
  }
  private async _generateHash(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }
}
