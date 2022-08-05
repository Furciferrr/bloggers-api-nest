import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './entities/post.schema';
import mongoose, { Model, ObjectId } from 'mongoose';
import { UpdatePostDto } from './dto/update-post.dto';
import { DBType } from 'src/types';
import { IPostRepository } from './interfaces';
import { PostDBType } from './types';

@Injectable()
export class PostRepository implements IPostRepository {
  constructor(
    @InjectModel(Post.name)
    private postsCollection: Model<PostDocument>,
  ) {}
  async getPosts(pageNumber: number, pageSize: number): Promise<PostDBType[]> {
    return this.postsCollection
      .find({})
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .select(['-__v', '-reactions'])
      .lean();
  }

  async getTotalCount(): Promise<number> {
    return await this.postsCollection.countDocuments();
  }
  async getPostById(id: string): Promise<PostDBType | null> {
    return this.postsCollection.findOne({ id }).select(['-__v']).lean();
  }
  async getPostByIdWithObjectId(
    id: string,
  ): Promise<(PostDBType & { _id: ObjectId }) | null> {
    return this.postsCollection.findOne({ id }).select(['-__v']).lean();
    //.populate('-_id -__v -target');
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

  async updateReaction(
    id: string,
    objectId: mongoose.Types.ObjectId,
  ): Promise<boolean> {
    const result = await this.postsCollection.updateOne(
      { id },
      { $addToSet: { reactions: objectId as any } },
    );
    return result.modifiedCount === 1;
  }

  async createPost(
    post: Omit<PostDBType, '_id'>,
  ): Promise<Omit<PostDBType, '_id'>> {
    await this.postsCollection.create(post);
    return post;
  }

  async getPostsByBloggerId(
    bloggerId: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<DBType<PostDBType>> {
    const result = await this.postsCollection.aggregate([
      {
        $facet: {
          items: [
            { $match: { bloggerId } },
            { $skip: (pageNumber - 1) * pageSize },
            { $limit: pageSize },
            { $project: { postId: 0, __v: 0, reactions: 0 } },
          ],
          pagination: [{ $count: 'totalCount' }],
        },
      },
    ]);

    return result[0] as DBType<PostDBType>;
  }

  async deleteAllPosts(): Promise<any> {
    const result = await this.postsCollection.remove({});
    return result;
  }
}
