import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.schema';
import { UserRepository } from './users.repository';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MailSender } from '../../adapters/email-adapter';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserSQLRepository } from './usersSQL.repository';
import { AuthGuard } from '../../guards/auth.guard';
import { UsersModule } from './users.module';
import ormConfig from '../../ormConfig';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        //MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        TypeOrmModule.forRoot(ormConfig),
        TypeOrmModule.forFeature([UserEntity]),
        ConfigModule,
      ],
      controllers: [UsersController],
      providers: [
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            query: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create user', async () => {
    const randomNumber = Math.floor(Math.random() * (999 - 100 + 1)) + 100;
    const body = {
      login: 'test' + randomNumber,
      password: 'test',
      email: `3643766+${randomNumber}@mail.ru`,
    };
    const result = await controller.createUser(body);
    expect(result).toBeDefined();
    expect(result.login).toBe(body.login);
    expect(result.id).toBeDefined();
  });

  it('get users', async () => {
    const pageNumber = '1';
    const pageSize = '10';
    const result = await controller.getUsers({
      pageNumber,
      pageSize,
    });
    expect(result).toBeDefined();

    expect(result.items.length).toBeLessThanOrEqual(+pageSize);

    if (result.items.length > 0) {
      result.items.forEach((item) => {
        expect(item).toEqual({
          id: expect.any(String),
          login: expect.any(String),
        });
      });
    }
  });
});
