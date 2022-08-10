import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from './entities/post.entity';
import { PostDBType } from './types';
import { IPostRepository } from './interfaces';
import { UpdatePostDto } from './dto/update-post.dto';
import { DBType } from 'src/types';

@Injectable()
export class PostsSQLRepository implements IPostRepository {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postsRepository: Repository<PostEntity>,
  ) {}

  async getPosts(pageNumber: number, pageSize: number): Promise<PostDBType[]> {
    const result = await this.postsRepository.query(`
      SELECT *
      FROM posts p
      ORDER BY p.id
      LIMIT ${pageSize}
      OFFSET ${(pageNumber - 1) * pageSize};
    `);
    return result;
  }

  async getTotalCount(): Promise<number> {
    const result = await this.postsRepository.query(`
      SELECT COUNT(*) FROM posts
    `);
    return result[0].count;
  }

  async getPostById(id: string): Promise<PostDBType | null> {
    const posts: PostDBType[] = await this.postsRepository.query(`
      SELECT * FROM posts
      WHERE id = '${id}'
    `);
    if (!posts.length) {
      return null;
    }
    return posts[0];
  }

  async deletePostById(id: string): Promise<boolean> {
    const deletedPost = await this.postsRepository.query(`
      DELETE FROM posts WHERE id = '${id}'
    `);
    return deletedPost[1] === 1;
  }

  async deletePostsByBloggerId(id: string): Promise<boolean> {
    const deletedPost = await this.postsRepository.query(`
      DELETE FROM posts WHERE "bloggerId" = '${id}'
    `);
    return deletedPost[1] === 1;
  }

  async updatePostById(id: string, postDto: UpdatePostDto): Promise<boolean> {
    const updatedPost = await this.postsRepository.query(`
      UPDATE posts SET ${Object.keys(postDto)
        .map((key) => `"${key}" = '${postDto[key]}'`)
        .join(', ')}
        WHERE id = '${id}'`);
    return updatedPost;
  }

  async updateReaction(id: string, targetId: string): Promise<boolean> {
    return true;
  }

  async deleteAllPosts(): Promise<any> {
    return await this.postsRepository.query(`DELETE FROM posts`);
  }

  async getPostsByBloggerId(
    bloggerId: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<DBType<PostDBType>> {
    const conclusion = await this.postsRepository.query(`
      SELECT * FROM posts
      WHERE bloggerId = '${bloggerId}'
      ORDER BY id
      LIMIT ${pageSize}
      OFFSET ${(pageNumber - 1) * pageSize};`);
    return conclusion;
  }

  async createPost(
    post: Omit<PostDBType, '_id'>,
  ): Promise<Omit<PostDBType, '_id'>> {
    const result = await this.postsRepository.query(`
    INSERT INTO posts ("title", "content", "shortDescription", "bloggerId")  
    VALUES ('${post.title}', '${post.content}', '${post.shortDescription}', ${post.bloggerId}) Returning *;`);
    return result[0];
  }
}
