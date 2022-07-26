import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { BloggersService } from 'src/bloggers/bloggers.service';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly bloggersService: BloggersService,
  ) {}

  @Post()
  async create(@Body() createPostDto: CreatePostDto) {
    const blogger = await this.bloggersService.findOne(createPostDto.bloggerId);
    if (!blogger) {
      throw new HttpException('Not Found', HttpStatus.BAD_REQUEST);
    }
    const newPost = await this.postsService.create(createPostDto);
    if (!newPost) {
      throw new HttpException('Not Found', HttpStatus.BAD_REQUEST);
    }
    return newPost;
  }

  @Get()
  findAll(
    @Query()
    query: {
      pageNumber: string;
      pageSize: string;
    },
  ) {
    return this.postsService.findAll(+query.pageNumber, +query.pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
