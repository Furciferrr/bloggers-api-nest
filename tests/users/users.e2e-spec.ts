import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { dataExample } from './data-example';
import { AuthGuard } from '../../src/guards/auth.guard';
import { AppModule } from '../../src/app.module';

describe('UsersModule (e2e)', () => {
  let app: INestApplication;
  let userId: number;

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

  it('/ (POST) Create User', async () => {
    const body = dataExample.userRegister;
    const response = await request(app.getHttpServer())
      .post('/users')
      .send(body)
      .expect(201);

    const result = response.body;
    userId = result.id;

    expect(result).toEqual({
      id: expect.any(String),
      login: dataExample.userRegister.login,
    });
  });

  it('/ (GET)', async () => {
    const pageNumber = '1';
    const pageSize = '10';

    const response = await request(app.getHttpServer())
      .get(`/users?pageNumber=${pageNumber}&pageSize=${pageSize}`)
      .expect(200);

    const result = response.body;

    expect(result.items.length).toBeLessThanOrEqual(+pageSize);
    expect(result.page).toBe(+pageNumber);
    expect(result.pageSize).toBe(+pageSize);

    if (result.items.length > 0) {
      result.items.forEach((item: any) => {
        expect(item).toEqual({
          id: expect.any(String),
          login: expect.any(String),
        });
      });
    }
  });

  afterAll(async () => {
    await request(app.getHttpServer()).delete(`/users/${userId}`).expect(204);
    await app.close();
  });
});
