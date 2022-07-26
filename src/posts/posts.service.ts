import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostDBType } from './types';
import { PostRepository } from './posts.repository';
import { BloggerRepository } from 'src/bloggers/bloggers.repository';
import { getRandomNumber } from 'src/shared/utils';
import { ResponseType } from 'src/types';

@Injectable()
export class PostsService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly bloggerRepository: BloggerRepository,
  ) {}
  async create(createPostDto: CreatePostDto): Promise<PostDBType | false> {
    const blogger = await this.bloggerRepository.getBloggerById(
      createPostDto.bloggerId,
    );
    if (!blogger) {
      return false;
    }
    const newPost: PostDBType = {
      id: getRandomNumber().toString(),
      title: createPostDto.title,
      shortDescription: createPostDto.shortDescription,
      content: createPostDto.content,
      bloggerId: createPostDto.bloggerId,
      bloggerName: blogger.name,
    };
    await this.postRepository.createPost(newPost);
    return newPost;
  }

  async findAll(
    pageNumber: number,
    pageSize: number,
  ): Promise<ResponseType<PostDBType>> {
    const posts = await this.postRepository.getPosts(
      pageNumber || 1,
      pageSize || 10,
    );
    const totalCount = await this.postRepository.getTotalCount();
    const pagesCount = Math.ceil(totalCount / (pageSize || 10));
    const buildResponse = {
      pagesCount,
      page: pageNumber || 1,
      pageSize: pageSize || 10,
      totalCount,
      items: posts,
    };
    return buildResponse;
  }

  async findOne(id: string): Promise<PostDBType | null> {
    return this.postRepository.getPostById(id);
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
  ): Promise<400 | 404 | 204> {
    const blogger = await this.bloggerRepository.getBloggerById(
      updatePostDto.bloggerId,
    );
    if (!blogger) {
      return 400;
    }
    const result = await this.postRepository.updatePostById(id, updatePostDto);

    return result ? 204 : 404;
  }

  async remove(id: string) {
    return await this.postRepository.deletePostById(id);
  }

  async getPostsByBloggerId(
    bloggerId: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<ResponseType<PostDBType> | false> {
    const blogger = await this.bloggerRepository.getBloggerById(bloggerId);
    if (!blogger) {
      return false;
    }
    const resultPosts = await this.postRepository.getPostByBloggerId(
      bloggerId,
      pageNumber || 1,
      pageSize || 10,
    );
    const { pagination, ...result } = resultPosts;
    return {
      pagesCount: Math.ceil(pagination[0].totalCount / (pageSize || 10)),
      page: pageNumber | 1,
      pageSize: pageSize || 10,
      totalCount: pagination[0].totalCount,
      ...result,
    };
  }
}
