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

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    forwardRef(() => BloggersModule),
    ReactionsModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, PostRepository, BloggersService, ReactionsService],
  exports: [PostRepository, PostsService],
})
export class PostsModule {}
