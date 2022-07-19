import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './entities/post.entity';
import { Model } from 'mongoose';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { DBType } from 'src/types';

@Injectable()
export class PostRepository {
  constructor(
    @InjectModel(Post.name)
    private postsCollection: Model<PostDocument>,
  ) {}
  async getPosts(pageNumber: number, pageSize: number): Promise<Post[]> {
    return this.postsCollection
      .find({})
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .select(['-_id', '-__v']);
  }
  async getTotalCount(): Promise<number> {
    return await this.postsCollection.countDocuments();
  }
  async getPostById(id: string): Promise<Post | null> {
    return this.postsCollection.findOne({ id }).select(['-_id', '-__v']);
  }
  async deletePostById(id: string): Promise<boolean> {
    const result = await this.postsCollection.deleteOne({ id });
    return result.deletedCount === 1;
  }
  async deletePostsByBloggerId(id: string): Promise<boolean> {
    try {
      await this.postsCollection.deleteMany({ bloggerId: id });
      return true;
    } catch (e) {
      return false;
    }
  }

  async updatePostById(id: string, postDto: UpdatePostDto): Promise<boolean> {
    const result = await this.postsCollection.updateOne(
      { id },
      { $set: postDto },
    );
    return result.modifiedCount === 1;
  }

  async createPost(post: Post): Promise<Post> {
    await this.postsCollection.create(post);
    return post;
  }

  async getPostByBloggerId(
    bloggerId: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<DBType<Post>> {
    const result = await this.postsCollection.aggregate([
      {
        $facet: {
          items: [
            { $match: { bloggerId } },
            { $skip: (pageNumber - 1) * pageSize },
            { $limit: pageSize },
            { $project: { _id: 0, postId: 0, __v: 0 } },
          ],
          pagination: [{ $count: 'totalCount' }],
        },
      },
    ]);
    return result[0] as DBType<Post>;
  }
}
