import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { dataExample } from './data-example';
import { BaseAuthGuard } from '../../src/guards/base-auth.guard';
import { AppModule } from '../../src/app.module';

describe('PostsModule (e2e)', () => {
  let app: INestApplication;
  let bloggerId: string;
  let postId: string;

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

  it('/ (POST) Create blogger', async () => {
    const body = dataExample.blogger;
    const response = await request(app.getHttpServer())
      .post('/bloggers')
      .send(body)
      .expect(201);
    const result = response.body;
    bloggerId = result.id;
  });

  it('/ (POST) Create post', async () => {
    const body = dataExample.post;
    const response = await request(app.getHttpServer())
      .post('/posts')
      .send({ ...body, bloggerId })
      .expect(201);
    const result = response.body;
    postId = result.id;
  });

  it('/ (GET) Created post', async () => {
    const response = await request(app.getHttpServer())
      .get(`/posts/${postId}`)
      .expect(200);

    const result = response.body;

    expect(result).toEqual({
      id: expect.any(String),
      title: dataExample.post.title,
      shortDescription: dataExample.post.shortDescription,
      content: dataExample.post.content,
      addedAt: expect.any(String),
      bloggerId: bloggerId,
      bloggerName: dataExample.blogger.name,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [],
      },
    });
  });

  it('/ (GET) All', async () => {
    const pageNumber = '1';
    const pageSize = '10';

    const response = await request(app.getHttpServer())
      .get(`/posts?pageNumber=${pageNumber}&pageSize=${pageSize}`)
      .expect(200);

    const result = response.body;

    expect(result.items.length).toBeLessThanOrEqual(+pageSize);
    expect(result.page).toBe(+pageNumber);
    expect(result.pageSize).toBe(+pageSize);

    if (result.items.length > 0) {
      result.items.forEach((item: any) => {
        expect(item).toEqual({
          id: expect.any(String),
          title: expect.any(String),
          shortDescription: expect.any(String),
          content: expect.any(String),
          addedAt: expect.any(String),
          bloggerId: expect.any(String),
          bloggerName: expect.any(String),
          extendedLikesInfo: {
            likesCount: expect.any(Number),
            dislikesCount: expect.any(Number),
            myStatus: expect.stringMatching(/None|Like|Dislike/),
            newestLikes: expect.any(Array),
          },
        });
      });
    }
  });

  afterAll(async () => {
    await request(app.getHttpServer())
      .delete(`/bloggers/${bloggerId}`)
      .expect(204);
    await request(app.getHttpServer()).delete(`/posts/${postId}`).expect(204);
    await app.close();
  });
});
