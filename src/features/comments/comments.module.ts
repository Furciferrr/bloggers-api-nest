import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema, Comment } from './entities/comment.schema';
import { CommentsRepository } from './comments.repository';
import { ReactionsService } from '../reactions/reactions.service';
import { CqrsModule } from '@nestjs/cqrs';
import { ReactionsModule } from '../reactions/reactions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { CommentsSQLRepository } from './commentsSQL.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    TypeOrmModule.forFeature([CommentEntity]),
    ReactionsModule,
    CqrsModule,
  ],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    { provide: CommentsRepository, useClass: CommentsSQLRepository },
    ReactionsService,
  ],
  exports: [CommentsRepository, CommentsService],
})
export class CommentsModule {}
