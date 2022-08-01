import { ResponseType } from 'src/types';
import { CreateBloggerDto } from '../dto/create-blogger.dto';
import { UpdateBloggerDto } from '../dto/update-blogger.dto';
import { BloggerDBType } from '../types';

export interface IBloggerRepository {
  getBloggers(
    pageNumber: number,
    pageSize: number,
    searchTerm?: string,
  ): Promise<Array<BloggerDBType>>;
  getTotalCount(searchTerm?: string): Promise<number>;

  getBloggerById(id: string): Promise<BloggerDBType | null>;
  deleteBloggerById(id: string): Promise<boolean>;
  updateBloggerById(id: string, dto: UpdateBloggerDto): Promise<boolean>;
  createBlogger(blogger: BloggerDBType): Promise<BloggerDBType>;
}

export interface IBloggerService {
  findAll(
    pageNumber: number,
    pageSize: number,
    searchTerm?: string,
  ): Promise<ResponseType<BloggerDBType>>;
  findOne(id: string): Promise<BloggerDBType | null>;
  remove(id: string): Promise<boolean>;
  update(id: string, dto: UpdateBloggerDto): Promise<boolean>;
  create(blogger: CreateBloggerDto): Promise<BloggerDBType>;
}
