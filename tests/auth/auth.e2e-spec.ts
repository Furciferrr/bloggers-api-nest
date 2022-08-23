import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { dataExample } from './data-example';
import { AuthGuard } from '../../src/guards/auth.guard';
import { AppModule } from '../../src/app.module';

describe('UsersModule (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let userId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (POST) Registration', async () => {
    const body = dataExample.userRegister;
    return await request(app.getHttpServer())
      .post('/auth/registration')
      .send(body)
      .expect(201);
  });

  it('/ (POST) Login', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        login: dataExample.userRegister.login,
        password: dataExample.userRegister.password,
      })
      .expect(200);
    expect(typeof response.body.accessToken).toBe('string');
    accessToken = response.body.accessToken;
  });

  it('/ (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get(`/auth/me`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    const result = response.body;
    expect(result).toEqual({
      userId: expect.any(String),
      login: dataExample.userRegister.login,
    });
    userId = result.userId;
  });

  afterAll(async () => {
    await request(app.getHttpServer()).delete(`/users/${userId}`).expect(204);
    await app.close();
  });
});
