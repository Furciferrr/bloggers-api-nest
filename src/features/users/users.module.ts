import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthGuard } from 'src/guards/auth.guard';
import { User, UserSchema } from './entities/user.schema';
import { UserRepository } from './users.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MailSender } from 'src/adapters/email-adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    TypeOrmModule.forFeature([UserEntity]),
    ConfigModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthGuard, UserRepository, MailSender],
  exports: [UsersService, UserRepository],
})
export class UsersModule {}
