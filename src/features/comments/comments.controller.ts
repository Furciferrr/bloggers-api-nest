import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { User } from '../../decorators/user.decorator';
import { UpdateLikeStatusDto } from '../posts/dto/update-likeStatus.dto';
import { UserViewType } from '../users/types';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':id')
  findOne(@Param('id') id: string, @User() user: UserViewType) {
    return this.commentsService.findOne(id, user);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(id, updateCommentDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.commentsService.remove(id);
  }

  @Put(':id/like-status')
  @HttpCode(204)
  @UseGuards(AuthGuard)
  async reaction(
    @Param('id') id: string,
    @Body() updateLikeStatusDto: UpdateLikeStatusDto,
    @User('id') userId: string,
  ) {
    const result = await this.commentsService.updateLikeStatus(
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
