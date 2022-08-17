import { Injectable } from '@nestjs/common';
import { PostsService } from './features/posts/posts.service';
import { UsersService } from './features/users/users.service';

@Injectable()
export class AppService {
  constructor(
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async resetAllData() {
    this.usersService.deleteAllUsers();
    this.postsService.deleteAllPosts();
    return;
  }
}
