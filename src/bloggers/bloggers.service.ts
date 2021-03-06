import { Injectable } from '@nestjs/common';
import { PostRepository } from 'src/posts/posts.repository';
import { ResponseType } from 'src/types';
import { BloggerRepository } from './bloggers.repository';
import { CreateBloggerDto } from './dto/create-blogger.dto';
import { UpdateBloggerDto } from './dto/update-blogger.dto';
import { BloggerDBType } from './types';

@Injectable()
export class BloggersService {
  constructor(
    private readonly bloggersRepository: BloggerRepository,
    private readonly postRepository: PostRepository,
  ) {}

  create(createBloggerDto: CreateBloggerDto) {
    return 'This action adds a new blogger';
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

  update(id: number, updateBloggerDto: UpdateBloggerDto) {
    return `This action updates a #${id} blogger`;
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
