import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig from '../src/ormConfig';
import { UserEntity } from '../src/features/users/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { Repository } from 'typeorm';
import { UsersModule } from '../src/features/users/users.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<UserEntity>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        TypeOrmModule.forRoot(ormConfig),
        TypeOrmModule.forFeature([UserEntity]),
        ConfigModule,
      ],
    })
      .overrideProvider(Repository<UserEntity>)
      .useValue(repository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', async () => {
    const pageNumber = '1';
    const pageSize = '10';

    const response = await request(app.getHttpServer())
      .get('/users')
      .expect(200);

    const result = response.body;

    expect(result.items.length).toBeLessThanOrEqual(+pageSize);

    if (result.items.length > 0) {
      result.items.forEach((item: any) => {
        expect(item).toEqual({
          id: expect.any(String),
          login: expect.any(String),
        });
      });
    }
  });

  it('/ (POST)', async () => {
    const randomNumber = Math.floor(Math.random() * (999 - 100 + 1)) + 100;
    const body = {
      login: 'test' + randomNumber,
      password: 'test',
      email: `3643766+${randomNumber}@mail.ru`,
    };
    const response = await request(app.getHttpServer())
      .post('/users')
      .send(body)
      .expect(201);

    const result = response.body;

    expect(result).toEqual({
      id: expect.any(String),
      login: expect.any(String),
    });
  });
});
