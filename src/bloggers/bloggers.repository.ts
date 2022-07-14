import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blogger, BloggerDocument } from './entities/blogger.entity';
import { Model } from 'mongoose';
import { UpdateBloggerDto } from './dto/update-blogger.dto';
import { CreateBloggerDto } from './dto/create-blogger.dto';

@Injectable()
export class BloggerRepository {
  constructor(
    @InjectModel(Blogger.name)
    private bloggersCollection: Model<BloggerDocument>,
  ) {}
  async getBloggers(
    pageNumber: number,
    pageSize: number,
    searchTerm?: string,
  ): Promise<Array<Blogger>> {
    const bloggers: Array<any> = await this.bloggersCollection
      .find({ name: { $regex: searchTerm || '' } })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .select(['-_id', '-__v']);
    return bloggers as Blogger[];
  }
  async getTotalCount(searchTerm?: string): Promise<number> {
    return await this.bloggersCollection.countDocuments({
      name: { $regex: searchTerm || '' },
    });
  }

  async getBloggerById(id: string): Promise<Blogger | null> {
    const blogger: Blogger | null = await this.bloggersCollection
      .findOne({ id })
      .select(['-_id', '-__v']);
    return blogger;
  }
  async deleteBloggerById(id: string): Promise<boolean> {
    const result = await this.bloggersCollection.deleteOne({ id });
    return result.deletedCount === 1;
  }
  async updateBloggerById(id: string, dto: UpdateBloggerDto): Promise<boolean> {
    const result = await this.bloggersCollection.updateOne(
      { id },
      { $set: { ...dto } },
    );

    return result.matchedCount === 1;
  }
  async createBlogger(blogger: CreateBloggerDto): Promise<any> {
    await this.bloggersCollection.create(blogger);
    return blogger;
  }
}
