import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { BloggersService } from './bloggers.service';
import { CreateBloggerDto } from './dto/create-blogger.dto';
import { UpdateBloggerDto } from './dto/update-blogger.dto';

@Controller('bloggers')
export class BloggersController {
  constructor(private readonly bloggersService: BloggersService) {}

  @Post()
  create(@Body() createBloggerDto: CreateBloggerDto) {
    return this.bloggersService.create(createBloggerDto);
  }

  @Get()
  async findAll(
    @Query()
    query: {
      pageNumber: string;
      pageSize: string;
      searchNameTerm?: string;
    },
  ) {
    const pageNumber = query.pageNumber as string;
    const pageSize = query.pageSize as string;
    const searchTerm = query.searchNameTerm as string;
    const bloggers = await this.bloggersService.findAll(
      +pageNumber,
      +pageSize,
      searchTerm,
    );
    return bloggers;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bloggersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBloggerDto: UpdateBloggerDto) {
    return this.bloggersService.update(+id, updateBloggerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bloggersService.remove(id);
  }
}
