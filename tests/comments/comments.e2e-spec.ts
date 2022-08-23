import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { dataExample } from './data-example';
import { BaseAuthGuard } from '../../src/guards/base-auth.guard';
import { AppModule } from '../../src/app.module';

describe('CommentsModule (e2e)', () => {
  let app: INestApplication;
  let bloggerId: string;
  let postId: string;
  let commentId: string;
  let accessToken: string;
  let userId: string;

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

  it('/ (GET) Auth me for comments', async () => {
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

  it('/ (POST) Create comment', async () => {
    const body = dataExample.comment;
    const response = await request(app.getHttpServer())
      .post(`/posts/${postId}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send(body)
      .expect(201);
    const result = response.body;
    commentId = result.id;
  });

  it('/ (GET) Get new comment', async () => {
    const response = await request(app.getHttpServer())
      .get(`/comments/${commentId}`)
      .expect(200);

    const result = response.body;

    expect(result).toEqual({
      id: expect.any(String),
      content: expect.any(String),
      addedAt: expect.any(String),
      userId: expect.any(String),
      userLogin: expect.any(String),
      likesInfo: {
        likesCount: expect.any(Number),
        dislikesCount: expect.any(Number),
        myStatus: 'None',
      },
    });
  });

  it('/ (GET) All Comments', async () => {
    const pageNumber = '1';
    const pageSize = '10';

    const response = await request(app.getHttpServer())
      .get(
        `/posts/${postId}/comments?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      )
      .expect(200);

    const result = response.body;

    expect(result.items.length).toBeLessThanOrEqual(+pageSize);
    expect(result.page).toBe(+pageNumber);
    expect(result.pageSize).toBe(+pageSize);

    if (result.items.length > 0) {
      result.items.forEach((item: any) => {
        expect(item).toEqual({
          id: expect.any(String),
          content: expect.any(String),
          addedAt: expect.any(String),
          userId: expect.any(String),
          userLogin: expect.any(String),
          likesInfo: {
            likesCount: expect.any(Number),
            dislikesCount: expect.any(Number),
            myStatus: expect.stringMatching(/None|Like|Dislike/),
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
    await request(app.getHttpServer()).delete(`/users/${userId}`).expect(204);
    //await request(app.getHttpServer()).delete(`/comments/${userId}`).expect(204);
    await app.close();
  });
});
