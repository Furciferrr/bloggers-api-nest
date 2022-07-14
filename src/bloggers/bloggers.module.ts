import { Module } from '@nestjs/common';
import { BloggersService } from './bloggers.service';
import { BloggersController } from './bloggers.controller';
import { BloggerRepository } from './bloggers.repository';
import { Blogger, BloggerSchema } from './entities/blogger.entity';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blogger.name, schema: BloggerSchema }]),
    ConfigModule,
  ],
  controllers: [BloggersController],
  providers: [BloggersService, BloggerRepository],
})
export class BloggersModule {}
