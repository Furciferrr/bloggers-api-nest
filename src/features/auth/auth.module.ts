import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../../features/users/users.module';
import { MailSender } from '../../adapters/email-adapter';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RequestAttempt,
  RequestAttemptSchema,
} from './entities/requestAttemption.schema';
import { CountAttemptGuard } from '../../guards/countAttemptions.guard';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([
      { name: RequestAttempt.name, schema: RequestAttemptSchema },
    ]),
  ],
  providers: [AuthService, MailSender, CountAttemptGuard],
  controllers: [AuthController],
})
export class AuthModule {}
