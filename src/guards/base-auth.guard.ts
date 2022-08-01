import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class BaseAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
    }
    if (request.headers.authorization?.split(' ')[0] !== 'Basic') {
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
    }
    try {
      const decode = Buffer.from(token, 'base64').toString('ascii');
      const creds = decode.split(':');
      if (creds[0] !== 'admin' || creds[1] !== 'qwerty') {
        throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
      }
    } catch (e) {
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
    }
    return true;
  }
}
