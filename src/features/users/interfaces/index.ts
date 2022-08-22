import { ErrorType, ResponseType, ServiceResponseType } from '../../../types';
import { CreateUserDto } from '../dto/createUser.dto';
import { UserDBType, UserViewType } from '../types';

export interface IUserRepository {
  getUsers(pageNumber: number, pageSize: number): Promise<UserViewType[]>;
  getTotalCount(): Promise<number>;
  getUserByLogin(login: string): Promise<UserDBType | null>;
  getUserByEmail(email: string): Promise<UserDBType | null>;
  getUserById(id: string): Promise<UserDBType | null>;
  getManyUsersByIds(ids: string[]): Promise<UserViewType[]>;
  getUserByLoginOrEmail(
    login: string,
    email: string,
  ): Promise<UserDBType | null>;
  getUserByConfirmationCode(
    confirmationCode: string,
  ): Promise<UserDBType | null>;
  updateUserById(user: Partial<UserDBType> & { id: string }): Promise<boolean>;
  deleteUserById(id: string): Promise<boolean>;
  createUser(user: UserDBType): Promise<UserViewType>;
  deleteAllUsers: () => Promise<any>;
}

export interface IUserService {
  getUsers(
    pageNumber?: number,
    pageSize?: number,
  ): Promise<ResponseType<UserViewType>>;
  deleteUserById(id: string): Promise<boolean>;
  getUserById(id: string): Promise<UserViewType | null>;
  getManyUsers(ids: string[]): Promise<UserViewType[]>;
  createUser(
    user: CreateUserDto,
  ): Promise<
    | ({ result: UserViewType } & { resultCode: 0 })
    | (ErrorType & { resultCode: 1 })
  >;
  getUserByLoginOrEmail(
    login: string,
    email: string,
  ): Promise<UserViewType | null>;
  confirmEmail(code: string): Promise<boolean>;
  checkCredentials(
    login: string,
    password: string,
  ): Promise<ServiceResponseType>;
  updateUser(user: Partial<UserDBType> & { id: string }): Promise<boolean>;
  deleteAllUsers: () => Promise<any>;
  generateJwt(user: any, expiresIn?: string, tkv?: number): string;
}
