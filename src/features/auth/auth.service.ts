import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from 'src/features/users/users.repository';
import { v4 as uuidv4 } from 'uuid';
import add from 'date-fns/add';
import { verify } from 'jsonwebtoken';
import { UserDBType } from 'src/features/users/types';
import { UsersService } from 'src/features/users/users.service';
import { ErrorType, ServiceResponseType } from 'src/types';
import { MailSender } from 'src/adapters/email-adapter';
import { InjectModel } from '@nestjs/mongoose';
import {
  RequestAttempt,
  RequestAttemptDocument,
} from './entities/requestAttemption.schema';
import { Model } from 'mongoose';
import { RequestAttemptType } from './types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    private readonly mailSender: MailSender,
    @InjectModel(RequestAttempt.name)
    private requestAttemptModel: Model<RequestAttemptDocument>,
  ) {}

  async resendingEmail(
    email: string,
  ): Promise<{ resultCode: 0 } | (ErrorType & { resultCode: 1 })> {
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      return {
        errorsMessages: [
          {
            message: 'Email is not exist',
            field: 'email',
          },
        ],
        resultCode: 1,
      };
    }
    if (user.emailConfirmation.isConfirmed) {
      return {
        errorsMessages: [
          {
            message: 'already confirmed;',
            field: 'email',
          },
        ],
        resultCode: 1,
      };
    }
    const emailConfirmation = {
      confirmationCode: uuidv4(),
      expirationDate: add(new Date(), { hours: 1, minutes: 2 }),
      isConfirmed: false,
    };
    const isUserUpdate = await this.userRepository.updateUserById({
      emailConfirmation: emailConfirmation,
      id: user.id,
    });
    if (!isUserUpdate) {
      return {
        errorsMessages: [
          {
            message: 'Error while updating user',
            field: 'email',
          },
        ],
        resultCode: 1,
      };
    }
    try {
      await this.mailSender.sendEmail(
        user.email,
        `code=${emailConfirmation.confirmationCode}`,
      );
    } catch (error) {
      console.error('service', error);
      return {
        errorsMessages: [
          {
            message: 'Something went wrong',
            field: 'email',
          },
        ],
        resultCode: 1,
      };
    }
    return {
      resultCode: 0,
    };
  }

  async checkRefreshToken(refreshToken: string): Promise<null | UserDBType> {
    try {
      const decode: any = verify(
        refreshToken,
        this.configService.get<string>('JWT_SECRET'),
      );
      const user = await this.userRepository.getUserById(decode.id);
      if (!user) {
        return null;
      }
      if (user.tokenVersion !== decode.tkv) {
        return null;
      }
      return user;
    } catch (error) {
      return null;
    }
  }

  async refreshToken(refreshToken: string): Promise<ServiceResponseType> {
    const user = await this.checkRefreshToken(refreshToken);
    if (!user) {
      return { resultCode: 1, data: {} };
    }
    const result = await this.userRepository.updateUserById({
      id: user.id,
      tokenVersion: user.tokenVersion + 1,
    });
    if (!result) {
      return { resultCode: 1, data: {} };
    }
    const accessToken = this.userService.generateJwt(
      user,
      this.configService.get<string>('JWT_EXPIRATION'),
    );
    const newRefreshToken = this.userService.generateJwt(
      user,
      this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
      user.tokenVersion + 1,
    );
    return {
      resultCode: 0,
      data: {
        accessToken: accessToken,
        refreshToken: newRefreshToken,
      },
    };
  }

  async me(
    accessToken: string,
  ): Promise<
    ServiceResponseType<
      { email: string; login: string; userId: string } | unknown
    >
  > {
    const user = await this.checkRefreshToken(accessToken);
    if (!user) {
      return { resultCode: 1, data: {} };
    }
    return {
      resultCode: 0,
      data: {
        email: user.email,
        login: user.login,
        userId: user.id,
      },
    };
  }

  async logout(refreshToken: string): Promise<ServiceResponseType<object>> {
    const user = await this.checkRefreshToken(refreshToken);
    if (!user) {
      return { resultCode: 1, data: {} };
    }
    const result = await this.userRepository.updateUserById({
      id: user.id,
      tokenVersion: user.tokenVersion + 1,
    });
    if (!result) {
      return { resultCode: 1, data: {} };
    }
    return { resultCode: 0, data: {} };
  }

  async getRequestAttemptsBetweenToDates(
    ip: string,
    startDate: Date,
    endDate: Date,
    path: string,
  ): Promise<Array<RequestAttemptType>> {
    const result = await this.requestAttemptModel
      .find({ ip, date: { $gte: startDate, $lte: endDate }, path })
      .select(['-_id', '-__v'])
      .lean();
    return result;
  }

  async createRequestAttempt(
    requestAttempt: RequestAttemptType,
  ): Promise<boolean> {
    const result = await this.requestAttemptModel.create(requestAttempt);
    return !!result;
  }

  async deleteAllRequests(): Promise<any> {
    const result = await this.requestAttemptModel.remove({});
    return result;
  }
}
