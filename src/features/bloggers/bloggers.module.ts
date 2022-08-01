import { Module } from '@nestjs/common';
import { BloggersService } from './bloggers.service';
import { BloggersController } from './bloggers.controller';
import { BloggerRepository } from './bloggers.repository';
import { Blogger, BloggerSchema } from './entities/blogger.schema';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsModule } from 'src/features/posts/posts.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blogger.name, schema: BloggerSchema }]),
    ConfigModule,
    PostsModule,
  ],
  controllers: [BloggersController],
  providers: [BloggersService, BloggerRepository],
  exports: [BloggerRepository],
})
export class BloggersModule {}
