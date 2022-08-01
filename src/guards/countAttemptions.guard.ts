import { AuthService } from '../features/auth/auth.service';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class CountAttemptGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest<Request>();
      const startDate = new Date(Date.now() - 10000);
      console.log(startDate);
      const requests = await this.authService.getRequestAttemptsBetweenToDates(
        request.ip,
        startDate,
        new Date(),
        request.path,
      );

      if (requests.length > 4) {
        //return false;
        throw new HttpException('Not authorized', HttpStatus.TOO_MANY_REQUESTS);
      } else {
        await this.authService.createRequestAttempt({
          ip: request.ip,
          date: new Date(),
          path: request.path,
        });
      }
      return true;
    } catch (e) {
      console.error('request middleware', e);
      //return false;
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }
}
