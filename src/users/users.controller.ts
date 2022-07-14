import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateUserDto } from './dto/createUser.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get()
  async getUsers(@Query() query: { pageNumber: string; pageSize: string }) {
    const pageNumber = query.pageNumber;
    const pageSize = query.pageSize;
    const users = await this.userService.getUsers(+pageNumber, +pageSize);
    return users;
  }
  @Post()
  async createUser(@Body() body: CreateUserDto) {
    const newUser = await this.userService.createUser(body);
    if (newUser.resultCode === 0) {
      return newUser.result;
    } else {
      throw new HttpException('Conflict', HttpStatus.CONFLICT);
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteUserById(@Param('id') id: string) {
    const isRemoved = await this.userService.deleteUserById(id);
    if (!isRemoved) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    if (isRemoved) {
      return isRemoved;
    }
  }
}
