import { Injectable } from '@nestjs/common';
import { PostRepository } from '../../features/posts/posts.repository';
import { getRandomNumber } from '../../shared/utils';
import { ResponseType } from '../../types';
import { BloggerRepository } from './bloggers.repository';
import { CreateBloggerDto } from './dto/create-blogger.dto';
import { UpdateBloggerDto } from './dto/update-blogger.dto';
import { IBloggerService } from './interfaces';
import { BloggerDBType } from './types';

@Injectable()
export class BloggersService implements IBloggerService {
  constructor(
    private readonly bloggersRepository: BloggerRepository,
    private readonly postRepository: PostRepository,
  ) {}

  async create(createBloggerDto: CreateBloggerDto) {
    const newBlogger: BloggerDBType = {
      id: getRandomNumber().toString(),
      name: createBloggerDto.name,
      youtubeUrl: createBloggerDto.youtubeUrl,
    };
    const result = await this.bloggersRepository.createBlogger(newBlogger);
    return result;
  }

  async findAll(
    pageNumber = 1,
    pageSize = 10,
    searchTerm?: string,
  ): Promise<ResponseType<BloggerDBType>> {
    const bloggers: Array<BloggerDBType> =
      await this.bloggersRepository.getBloggers(
        pageNumber || 1,
        pageSize || 10,
        searchTerm,
      );
    const totalCount = await this.bloggersRepository.getTotalCount(searchTerm);
    const pagesCount = Math.ceil(totalCount / (pageSize || 10));
    const buildResponse = {
      pagesCount,
      page: pageNumber || 1,
      pageSize: pageSize || 10,
      totalCount,
      items: bloggers,
    };
    return buildResponse;
  }

  async findOne(id: string): Promise<BloggerDBType | null> {
    const blogger: BloggerDBType | null =
      await this.bloggersRepository.getBloggerById(id);
    return blogger;
  }

  async update(id: string, updateBloggerDto: UpdateBloggerDto) {
    return await this.bloggersRepository.updateBloggerById(
      id,
      updateBloggerDto,
    );
  }

  async remove(id: string) {
    const result = await this.bloggersRepository.deleteBloggerById(id);
    if (result) {
      await this.postRepository.deletePostsByBloggerId(id);
      return true;
    } else {
      return false;
    }
  }
}
