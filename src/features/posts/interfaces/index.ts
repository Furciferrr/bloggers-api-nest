import { ResponseType } from 'src/types';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PaginateType, PostDBType, PostViewType } from '../types';

export interface IPostRepository {
  getPosts(pageNumber: number, pageSize: number): Promise<PostDBType[]>;
  getTotalCount(): Promise<number>;
  getPostById(id: string): Promise<PostDBType | null>;
  deletePostById(id: string): Promise<boolean>;
  deletePostsByBloggerId(id: string): Promise<boolean>;
  updatePostById(id: string, postDto: UpdatePostDto): Promise<boolean>;
  createPost(post: PostDBType): Promise<PostDBType>;
  getPostByBloggerId(
    bloggerId: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<PaginateType<PostDBType>>;
}

export interface IPostService {
  findAll(
    pageNumber: number,
    pageSize: number,
  ): Promise<ResponseType<PostViewType>>;
  getPostsByBloggerId(
    bloggerId: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<ResponseType<PostDBType> | false>;
  findOne(id: string): Promise<PostDBType | null>;
  remove(id: string): Promise<boolean>;
  update(id: string, postDto: UpdatePostDto): Promise<400 | 404 | 204>;
  create(postDto: CreatePostDto): Promise<PostDBType | false>;
}
