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
import { UserViewType } from '../users/types';
import { CommentsService } from '../comments/comments.service';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly bloggersService: BloggersService,
    private readonly commentsService: CommentsService,
  ) {}

  @Post()
  @UseGuards(BaseAuthGuard)
  async create(@Body() createPostDto: CreatePostDto) {
    const blogger = await this.bloggersService.findOne(createPostDto.bloggerId);
    if (!blogger) {
      throw new HttpException('BAD REQUEST', HttpStatus.BAD_REQUEST);
    }
    const newPost = await this.postsService.create(createPostDto);
    if (!newPost) {
      throw new HttpException('BAD REQUEST', HttpStatus.BAD_REQUEST);
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

  @Post('/:id/comments')
  @UseGuards(AuthGuard)
  async createComment(
    @Param('id') id: string,
    @Body() comment: { content: string },
    @User() user: UserViewType,
  ) {
    const foundPost = await this.postsService.findOne(id);
    if (!foundPost) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    const newComment = await this.commentsService.create(id, comment, user);
    if (!newComment) {
      throw new HttpException('BAD REQUEST', HttpStatus.BAD_REQUEST);
    }
    return newComment;
  }

  @Get('/:id/comments')
  async getCommentsByPostId(
    @Param('id') id: string,
    @Query()
    query: {
      pageNumber: string;
      pageSize: string;
    },
  ) {
    const pageNumber = query.pageNumber;
    const pageSize = query.pageSize;
    const foundPost = await this.postsService.findOne(id);
    if (!foundPost) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    const comments = await this.commentsService.getCommentsByPostId(
      id,
      +pageNumber,
      +pageSize,
    );

    return comments;
  }
}
