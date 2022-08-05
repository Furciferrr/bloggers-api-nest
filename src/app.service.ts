import { Injectable } from '@nestjs/common';
import { UsersService } from './features/users/users.service';

@Injectable()
export class AppService {
  constructor(private readonly userService: UsersService) {}
  getHello(): string {
    return 'Hello World!';
  }

  async resetAllData() {
    await this.userService.deleteAllUsers();
    return;
  }
}
