import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './features/users/users.module';
import { AuthModule } from './features/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthMiddleware } from './middlewares/authMiddleware';
import { BloggersModule } from './features/bloggers/bloggers.module';
import { PostsModule } from './features/posts/posts.module';
import { CommentsModule } from './features/comments/comments.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ReactionsModule } from './features/reactions/reactions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig from './ormConfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri:
          configService.get<string>('MONGO_URI_LOCAL') ||
          configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BloggersModule,
    PostsModule,
    CommentsModule,
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 5,
    }),
    ReactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [ConfigModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
