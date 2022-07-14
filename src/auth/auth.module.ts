import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { MailSender } from '../adapters/email-adapter';

@Module({
  imports: [UsersModule],
  providers: [AuthService, MailSender],
  controllers: [AuthController],
})
export class AuthModule {}
