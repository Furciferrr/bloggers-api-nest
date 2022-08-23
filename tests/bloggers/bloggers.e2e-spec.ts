import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { dataExample } from './data-example';
import { BaseAuthGuard } from '../../src/guards/base-auth.guard';
import { AppModule } from '../../src/app.module';

describe('BloggersModule (e2e)', () => {
  let app: INestApplication;
  let bloggerId: number;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(BaseAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (POST)', async () => {
    const body = dataExample.blogger;
    const response = await request(app.getHttpServer())
      .post('/bloggers')
      .send(body)
      .expect(201);

    const result = response.body;
    bloggerId = result.id;

    expect(result).toEqual({
      id: expect.any(String),
      name: dataExample.blogger.name,
      youtubeUrl: expect.any(String),
    });
  });

  it('/ (GET)', async () => {
    const pageNumber = '1';
    const pageSize = '10';

    const response = await request(app.getHttpServer())
      .get(`/bloggers?pageNumber=${pageNumber}&pageSize=${pageSize}`)
      .expect(200);

    const result = response.body;

    expect(result.items.length).toBeLessThanOrEqual(+pageSize);
    expect(result.page).toBe(+pageNumber);
    expect(result.pageSize).toBe(+pageSize);

    if (result.items.length > 0) {
      result.items.forEach((item: any) => {
        expect(item).toEqual({
          id: expect.any(String),
          name: expect.any(String),
          youtubeUrl: expect.any(String),
        });
      });
    }
  });

  afterAll(async () => {
    await request(app.getHttpServer())
      .delete(`/bloggers/${bloggerId}`)
      .expect(204);
    await app.close();
  });
});
