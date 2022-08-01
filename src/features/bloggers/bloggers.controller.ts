import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpException,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BaseAuthGuard } from 'src/guards/base-auth.guard';
import { PostsService } from 'src/features/posts/posts.service';
import { BloggersService } from './bloggers.service';
import { CreateBloggerDto } from './dto/create-blogger.dto';
import { UpdateBloggerDto } from './dto/update-blogger.dto';

@Controller('bloggers')
export class BloggersController {
  constructor(
    private readonly bloggersService: BloggersService,
    private readonly postsService: PostsService,
  ) {}

  @Post()
  @UseGuards(BaseAuthGuard)
  async create(@Body() createBloggerDto: CreateBloggerDto) {
    const newBlogger = await this.bloggersService.create(createBloggerDto);
    if (!newBlogger) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
    return newBlogger;
  }

  @Get()
  async findAll(
    @Query()
    query: {
      pageNumber: string;
      pageSize: string;
      searchNameTerm?: string;
    },
  ) {
    const pageNumber = query.pageNumber;
    const pageSize = query.pageSize;
    const searchTerm = query.searchNameTerm;
    const bloggers = await this.bloggersService.findAll(
      +pageNumber,
      +pageSize,
      searchTerm,
    );
    return bloggers;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const foundBlogger = await this.bloggersService.findOne(id);
    if (!foundBlogger) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return foundBlogger;
  }

  @Put(':id')
  @UseGuards(BaseAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateBloggerDto: UpdateBloggerDto,
  ) {
    const newBlogger = await this.bloggersService.update(id, updateBloggerDto);
    if (!newBlogger) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return;
  }

  @Delete(':id')
  @UseGuards(BaseAuthGuard)
  async remove(@Param('id') id: string) {
    const result = await this.bloggersService.remove(id);
    if (!result) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    if (result) {
      return;
    }
  }

  @Post('/:bloggerId/posts')
  @UseGuards(BaseAuthGuard)
  async createPost(
    @Param('bloggerId') bloggerId: string,
    @Body() createPostDto: any,
  ) {
    const newPost = await this.postsService.create({
      ...createPostDto,
      bloggerId,
    });
    if (!newPost) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    newPost.bloggerId = newPost.bloggerId;
    return newPost;
  }

  @Get('/:bloggerId/posts')
  async getPostsByBloggerId(
    @Param('bloggerId') bloggerId: string,
    @Query() query: { pageNumber: string; pageSize: string },
  ) {
    const posts = await this.postsService.getPostsByBloggerId(
      bloggerId,
      +query.pageNumber,
      +query.pageSize,
    );
    if (!posts) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return posts;
  }
}
