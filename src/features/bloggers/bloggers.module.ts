import { Module } from '@nestjs/common';
import { BloggersService } from './bloggers.service';
import { BloggersController } from './bloggers.controller';
import { BloggerRepository } from './bloggers.repository';
import { Blogger, BloggerSchema } from './entities/blogger.schema';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsModule } from '../../features/posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BloggerEntity } from './entities/blogger.entity';
import { BloggersSQLRepository } from './bloggersSQL.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blogger.name, schema: BloggerSchema }]),
    TypeOrmModule.forFeature([BloggerEntity]),
    ConfigModule,
    PostsModule,
  ],
  controllers: [BloggersController],
  providers: [
    BloggersService,
    { provide: BloggerRepository, useClass: BloggersSQLRepository },
  ],
  exports: [BloggerRepository],
})
export class BloggersModule {}
