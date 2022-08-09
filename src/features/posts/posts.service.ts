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
import { UsersService } from '../users/users.service';
import { UserViewType } from '../users/types';

@Injectable()
export class PostsService implements IPostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly bloggerRepository: BloggerRepository,
    private readonly reactionService: ReactionsService,
    private readonly userService: UsersService,
  ) {}
  async create(createPostDto: CreatePostDto): Promise<PostViewType | false> {
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
    const conclusion = await this.postRepository.createPost(newPost);
    const extendedLikesInfo = await this.buildExtendedLikesInfo(conclusion.id);

    return { ...conclusion, extendedLikesInfo };
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
      const extendedLikesInfo = await this.buildExtendedLikesInfo(post.id);
      const { _id, reactions, ...rest } = post;
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
    postId: string,
    userId?: string,
  ): Promise<ExtendedLikesInfoType> {
    const likesCount = await this.reactionService.likesCountByTargetId(
      postId,
      'post',
    );
    const dislikesCount = await this.reactionService.dislikesCountByTargetId(
      postId,
      'post',
    );
    const myStatus = await this.reactionService.getReactionByUserIdAndTargetId(
      postId,
      'post',
      userId,
    );
    const newestLikes = await this.reactionService.getNewestReactionsByTargetId(
      postId,
      3,
      'post',
    );

    const userPromises = newestLikes.map(async (like) => {
      const user = await this.userService.getUserById(like.userId);
      return user;
    });
    const users = await Promise.all(userPromises);

    return {
      likesCount,
      dislikesCount,
      myStatus: myStatus?.likeStatus || LikeStatus.None,
      newestLikes: newestLikes.map((reaction) => {
        return {
          userId: reaction.userId,
          addedAt: reaction.addedAt,
          login: users.find((user) => user.id === reaction.userId)?.login,
        };
      }),
    };
  }

  async findOne(id: string, user?: UserViewType): Promise<PostViewType | null> {
    const post = await this.postRepository.getPostByIdWithObjectId(id);
    if (!post) {
      return null;
    }

    const extendedLikesInfo = await this.buildExtendedLikesInfo(
      post.id,
      user?.id,
    );

    delete post._id;
    delete post.reactions;
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
    user: UserViewType,
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
      const extendedLikesInfo = await this.buildExtendedLikesInfo(
        post.id,
        user?.id,
      );
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
    userId?: string,
  ): Promise<any> {
    const post = await this.postRepository.getPostById(id);

    if (!post) {
      return false;
    }
    const userReaction =
      await this.reactionService.getReactionByUserIdAndTargetId(
        post.id,
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
            targetId: post.id,
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
