import SMTPTransport from 'nodemailer/lib/smtp-transport';
import {
  ServiceResponseType,
  ErrorType,
  RequestAttemptType,
  VideoType,
} from './types';
import { CreateUserDto } from './users/dto/createUser.dto';
import { UserDBType } from './users/types';

/* export interface IBodyValidator {
  validateAndConvert(classToConvert: any, body: {}): Promise<ValidationResult>;
} */

export interface IVideosRepository {
  getVideos(): Promise<VideoType[]>;
  getVideoById(id: number): Promise<VideoType | null>;
  deleteVideoById(id: number): Promise<boolean>;
  updateVideoById(id: number, title: string): Promise<boolean>;
  createVideo(title: string): Promise<VideoType>;
}

export interface IVideosController {
  getVideos(req: Request, res: Response): any;

  updateVideoById(req: Request, res: Response): any;

  deleteVideoById(req: Request, res: Response): any;
  createVideo(req: Request, res: Response): any;

  getVideoById(req: Request, res: Response): any;
}

export interface ITestController {
  deleteAllUsers(req: Request, res: Response): any;
}

export interface IAuthService {
  resendingEmail(email: string): Promise<any | null>;
  checkRefreshToken(refreshToken: string): Promise<null | UserDBType>;
  refreshToken(refreshToken: string): Promise<ServiceResponseType>;
  me(token: string): Promise<any>;
  logout(token: string): Promise<ServiceResponseType<Record<string, never>>>;
}

/* export interface IBloggerRepository {
  getBloggers(
    pageNumber: number,
    pageSize: number,
    searchTerm?: string,
  ): Promise<Array<Blogger>>;
  getTotalCount(searchTerm?: string): Promise<number>;

  getBloggerById(id: string): Promise<Blogger | null>;
  deleteBloggerById(id: string): Promise<boolean>;
  updateBloggerById(id: string, dto: BloggerDto): Promise<boolean>;
  createBlogger(blogger: Blogger): Promise<Blogger>;
} */

/* export interface IBloggerService {
  getBloggers(
    pageNumber: number,
    pageSize: number,
    searchTerm?: string,
  ): Promise<ResponseType<Blogger>>;
  getBloggerById(id: string): Promise<Blogger | null>;
  deleteBloggerById(id: string): Promise<boolean>;
  updateBloggerById(id: string, dto: BloggerDto): Promise<boolean>;
  createBlogger(blogger: BloggerDto): Promise<Blogger>;
} */

/* export interface IPostRepository {
  getPosts(pageNumber: number, pageSize: number): Promise<Post[]>;
  getTotalCount(): Promise<number>;
  getPostById(id: string): Promise<Post | null>;
  deletePostById(id: string): Promise<boolean>;
  deletePostsByBloggerId(id: string): Promise<boolean>;
  updatePostById(id: string, postDto: UpdatePostDto): Promise<boolean>;
  createPost(post: Post): Promise<Post>;
  getPostByBloggerId(
    bloggerId: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<DBType<Post>>;
} */

/* export interface IPostService {
  getPosts(pageNumber: number, pageSize: number): Promise<ResponseType<Post>>;
  getPostsByBloggerId(
    bloggerId: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<ResponseType<Post> | false>;
  getPostById(id: string): Promise<Post | null>;
  deletePostById(id: string): Promise<boolean>;
  updatePostById(id: string, postDto: UpdatePostDto): Promise<400 | 404 | 204>;
  createPost(postDto: PostDto): Promise<Post | false>;
} */

/* export interface ICommentsService {
  getCommentById(id: string): Promise<CommentDBType | null>;
  updateCommentById(id: string, commentDto: CommentDto): Promise<boolean>;
  deleteCommentById(id: string): Promise<boolean>;
  getCommentsByPostId(
    id: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<ResponseType<CommentResponse>>;
  createComment(
    postId: string,
    commentDto: CommentDto,
    user: UserViewType,
  ): Promise<CommentDBType>;
} */

/* export interface ICommentsRepository {
  getCommentById(id: string): Promise<CommentDBType | null>;
  updateCommentById(id: string, commentDto: CommentDto): Promise<boolean>;
  deleteCommentById(id: string): Promise<boolean>;
  getCommentsByPostId(
    id: string,
    pageNumber: number,
    pageSize: number,
  ): Promise<Array<CommentResponse>>;
  createComment(comment: CommentDBType): Promise<CommentDBType>;
  getTotalCount(postId: string): Promise<number>;
} */

export interface IMailSender {
  sendEmail(
    address: string,
    body: string,
  ): Promise<SMTPTransport.SentMessageInfo | undefined>;
}

export interface IRequestAttemptsRepository {
  getRequestAttemptsBetweenToDates(
    ip: string,
    startDate: Date,
    endDate: Date,
    path: string,
  ): Promise<Array<RequestAttemptType>>;
  createRequestAttempt(requestAttempt: RequestAttemptType): Promise<boolean>;
  deleteAllRequests(): Promise<any>;
}
