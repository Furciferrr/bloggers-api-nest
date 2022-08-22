import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthGuard } from '../../guards/auth.guard';
import { User, UserSchema } from './entities/user.schema';
import { UserRepository } from './users.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MailSender } from '../../adapters/email-adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserSQLRepository } from './usersSQL.repository';

@Module({
  imports: [
    //MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),

    TypeOrmModule.forFeature([UserEntity]),
    ConfigModule,
  ],
  controllers: [UsersController],
  providers: [
    { provide: UserRepository, useClass: UserSQLRepository },
    UsersService,
    AuthGuard,
    MailSender,
  ],
  exports: [UsersService, UserRepository],
})
export class UsersModule {}
