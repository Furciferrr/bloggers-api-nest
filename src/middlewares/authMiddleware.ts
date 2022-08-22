import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { UsersService } from '../features/users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly userService: UsersService,
    private configService: ConfigService,
  ) {}
  async use(
    req: Request & { headers: { authorization: string }; user: any },
    res: Response,
    next: NextFunction,
  ) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decode = verify(
        token,
        this.configService.get<string>('JWT_SECRET'),
      );

      const user = await this.userService.getUserById(
        decode.id ? decode.id : '',
      );

      req.user = user;
      next();
    } catch (error) {
      req.user = null;
      next();
    }
  }
}
