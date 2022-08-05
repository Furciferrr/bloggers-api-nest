import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ExtendedLikesInfoType, PostDBType, PostViewType } from './types';
import { PostRepository } from './posts.repository';
import { BloggerRepository } from 'src/features/bloggers/bloggers.repository';
import { getRandomNumber } from 'src/shared/utils';
import { ResponseType } from 'src/types';
import { IPostService } from './interfaces';
import { UpdateLikeStatusDto } from './dto/update-likeStatus.dto';
import { ReactionsService } from '../reactions/reactions.service';
import { LikeStatus } from '../reactions/types';
import { ObjectId } from 'mongoose';

@Injectable()
export class PostsService implements IPostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly bloggerRepository: BloggerRepository,
    private readonly reactionService: ReactionsService,
  ) {}
  async create(
    createPostDto: CreatePostDto,
  ): Promise<Omit<PostDBType, '_id'> | false> {
    const blogger = await this.bloggerRepository.getBloggerById(
      createPostDto.bloggerId,
    );
    if (!blogger) {
      return false;
    }
    const newPost: Omit<PostDBType, '_id'> = {
      id: getRandomNumber().toString(),
      title: createPostDto.title,
      shortDescription: createPostDto.shortDescription,
      content: createPostDto.content,
      bloggerId: createPostDto.bloggerId,
      bloggerName: blogger.name,
      reactions: [],
      addedAt: new Date(),
    };
    await this.postRepository.createPost(newPost);
    return newPost;
  }

  async findAll(
    pageNumber: number,
    pageSize: number,
  ): Promise<ResponseType<PostViewType>> {
    const posts = await this.postRepository.getPosts(
      pageNumber || 1,
      pageSize || 10,
    );

    const totalCount = await this.postRepository.getTotalCount();
    const pagesCount = Math.ceil(totalCount / (pageSize || 10));
    const postsViewPromises = posts.map(async (post) => {
      const extendedLikesInfo = await this.buildExtendedLikesInfo(post._id);
      const { _id, ...rest } = post;
      return { ...rest, extendedLikesInfo };
    });
    const postsView = await Promise.all(postsViewPromises);

    const buildResponse = {
      pagesCount,
      page: pageNumber || 1,
      pageSize: pageSize || 10,
      totalCount,
      items: postsView,
    };
    return buildResponse;
  }

  async buildExtendedLikesInfo(
    postObjectId: ObjectId,
    userId?: string,
  ): Promise<ExtendedLikesInfoType> {
    const likesCount = await this.reactionService.likesCountByTargetId(
      postObjectId,
      'post',
    );
    const dislikesCount = await this.reactionService.dislikesCountByTargetId(
      postObjectId,
      'post',
    );
    const myStatus = await this.reactionService.getReactionByUserIdAndTargetId(
      postObjectId,
      'post',
      userId,
    );
    const newestLikes = await this.reactionService.getNewestReactionsByTargetId(
      postObjectId,
      3,
      'post',
    );

    return {
      likesCount,
      dislikesCount,
      myStatus: myStatus?.likeStatus || LikeStatus.None,
      newestLikes,
    };
  }

  async findOne(id: string): Promise<PostViewType | null> {
    const post = await this.postRepository.getPostByIdWithObjectId(id);
    if (!post) {
      return null;
    }

    const extendedLikesInfo = await this.buildExtendedLikesInfo(
      post._id,
      post.bloggerId,
    );

    delete post._id;
    const withReactions = Object.assign(post, {
      extendedLikesInfo,
    });

    return withReactions;
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
  ): Promise<400 | 404 | 204> {
    const blogger = await this.bloggerRepository.getBloggerById(
      updatePostDto.bloggerId,
    );
    if (!blogger) {
      return 400;
    }
    const result = await this.postRepository.updatePostById(id, updatePostDto);

    return result ? 204 : 404;
  }

  async remove(id: string) {
    return await this.postRepository.deletePostById(id);
  }

  async getPostsByBloggerId(
    bloggerId: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<ResponseType<PostViewType> | false> {
    const blogger = await this.bloggerRepository.getBloggerById(bloggerId);
    if (!blogger) {
      return false;
    }
    const resultPosts = await this.postRepository.getPostsByBloggerId(
      bloggerId,
      pageNumber || 1,
      pageSize || 10,
    );
    const { pagination, ...result } = resultPosts;
    const postsViewPromises = result.items.map(async (post) => {
      const extendedLikesInfo = await this.buildExtendedLikesInfo(post._id);
      const { _id, ...rest } = post;
      return { ...rest, extendedLikesInfo };
    });
    const postsView = await Promise.all(postsViewPromises);
    return {
      pagesCount: Math.ceil(pagination[0].totalCount / (pageSize || 10)),
      page: pageNumber | 1,
      pageSize: pageSize || 10,
      totalCount: pagination[0].totalCount,
      items: postsView,
    };
  }

  async updateLikeStatus(
    id: string,
    updateLikeStatusDto: UpdateLikeStatusDto,
    userId: string,
  ): Promise<any> {
    const post = await this.postRepository.getPostByIdWithObjectId(id);

    if (!post) {
      return false;
    }
    const userReaction =
      await this.reactionService.getReactionByUserIdAndTargetId(
        post._id,
        'post',
        userId,
      );

    if (userReaction) {
      const result = await this.reactionService.update(userReaction.id, {
        likeStatus: updateLikeStatusDto.likeStatus,
      });
      return result;
    } else {
      const result = await this.reactionService.createCommandUseCase({
        likeStatus: updateLikeStatusDto.likeStatus,
        userId,
        target: {
          type: {
            type: 'post',
            targetId: post._id,
          },
        },
      });
      if (!result) {
        return false;
      }

      this.postRepository.updateReaction(id, result._id);

      return result;
    }
  }
}
