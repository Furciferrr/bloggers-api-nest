import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema, Comment } from './entities/comment.schema';
import { CommentsRepository } from './comments.repository';
import { ReactionsService } from '../reactions/reactions.service';
import { CqrsModule } from '@nestjs/cqrs';
import { ReactionsModule } from '../reactions/reactions.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    ReactionsModule,
    CqrsModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsRepository, ReactionsService],
  exports: [CommentsRepository, CommentsService],
})
export class CommentsModule {}
