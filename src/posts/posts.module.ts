import { forwardRef, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostRepository } from './posts.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './entities/post.entity';
import { BloggersService } from 'src/bloggers/bloggers.service';
import { BloggersModule } from 'src/bloggers/bloggers.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    forwardRef(() => BloggersModule),
  ],
  controllers: [PostsController],
  providers: [PostsService, PostRepository, BloggersService],
  exports: [PostRepository, PostsService],
})
export class PostsModule {}
