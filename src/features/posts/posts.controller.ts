import { AuthGuard } from './../../guards/auth.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  Query,
  UseGuards,
  Put,
  HttpCode,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { BloggersService } from 'src/features/bloggers/bloggers.service';
import { BaseAuthGuard } from 'src/guards/base-auth.guard';
import { UpdateLikeStatusDto } from './dto/update-likeStatus.dto';
import { User } from 'src/decorators/user.decorator';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly bloggersService: BloggersService,
  ) {}

  @Post()
  @UseGuards(BaseAuthGuard)
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

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(BaseAuthGuard)
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }

  @Put(':id/like-status')
  @HttpCode(204)
  @UseGuards(AuthGuard)
  async reaction(
    @Param('id') id: string,
    @Body() updateLikeStatusDto: UpdateLikeStatusDto,
    @User('id') userId: string,
  ) {
    const result = await this.postsService.updateLikeStatus(
      id,
      updateLikeStatusDto,
      userId,
    );
    if (!result) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return;
  }
}
