import { Injectable } from '@nestjs/common';
import { IBloggerRepository } from './interfaces/index';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blogger } from './entities/blogger.schema';
import { BloggerEntity } from './entities/blogger.entity';
import { BloggerDBType } from './types';
import { UpdateBloggerDto } from './dto/update-blogger.dto';

@Injectable()
export class BloggersSQLRepository implements IBloggerRepository {
  constructor(
    @InjectRepository(BloggerEntity)
    private readonly bloggerRepository: Repository<BloggerEntity>,
  ) {}

  async getBloggers(
    pageNumber: number,
    pageSize: number,
    searchTerm?: string,
  ): Promise<Array<Blogger>> {
    const result = await this.bloggerRepository.query(`
      SELECT id:text, name, "youtubeUrl"
      FROM bloggers b
      WHERE name ILIKE '%${searchTerm || ''}%'
      ORDER BY b.id
      LIMIT ${pageSize}
      OFFSET ${(pageNumber - 1) * pageSize};
    `);
    return result;
  }

  async getTotalCount(): Promise<number> {
    const result = await this.bloggerRepository.query(`
      SELECT COUNT(*) FROM bloggers
    `);
    return result[0].count;
  }

  async updateBloggerById(id: string, dto: UpdateBloggerDto): Promise<boolean> {
    const updatedUser = await this.bloggerRepository.query(`
      UPDATE bloggers SET ${Object.keys(dto)
        .map((key) => `"${key}" = '${dto[key]}'`)
        .join(', ')}
        WHERE id = '${id}'`);
    return updatedUser;
  }

  async getBloggerById(id: string): Promise<Blogger | null> {
    const bloggers: Blogger[] = await this.bloggerRepository.query(`
      SELECT id::text, name, "youtubeUrl" FROM bloggers
      WHERE id = ${id}
    `);

    if (!bloggers.length) {
      return null;
    }
    return bloggers[0];
  }

  async deleteBloggerById(id: string): Promise<boolean> {
    const deletedUser = await this.bloggerRepository.query(`
      DELETE FROM bloggers WHERE id = '${id}'
    `);
    return deletedUser[1] === 1;
  }

  async deleteAllBloggers(): Promise<any> {
    return await this.bloggerRepository.query(`DELETE FROM bloggers`);
  }

  async createBlogger(blogger: BloggerDBType): Promise<BloggerDBType> {
    const result = await this.bloggerRepository.query(`
    INSERT INTO bloggers ("name", "youtubeUrl")  VALUES ('${blogger.name}', '${blogger.youtubeUrl}') RETURNING *, id::text;`);
    return result[0];
  }
}
