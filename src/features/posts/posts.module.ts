import { CommentsModule } from './../comments/comments.module';
import { forwardRef, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostRepository } from './posts.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './entities/post.schema';
import { BloggersService } from 'src/features/bloggers/bloggers.service';
import { BloggersModule } from 'src/features/bloggers/bloggers.module';
import { ReactionsModule } from '../reactions/reactions.module';
import { ReactionsService } from '../reactions/reactions.service';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { PostsSQLRepository } from './postsSQL.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    TypeOrmModule.forFeature([PostEntity]),
    forwardRef(() => BloggersModule),
    ReactionsModule,
    CqrsModule,
    CommentsModule,
    UsersModule,
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    { provide: PostRepository, useClass: PostsSQLRepository },
    BloggersService,
    ReactionsService,
    UsersService,
  ],
  exports: [PostRepository, PostsService],
})
export class PostsModule {}
