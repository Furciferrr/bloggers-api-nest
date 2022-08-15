import { Injectable } from '@nestjs/common';
import { IUserRepository } from './interfaces/index';
import { UserDBType, UserViewType } from './types';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserSQLRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getUsers(pageNumber = 1, pageSize = 10): Promise<UserViewType[]> {
    return this.userRepository.query(`
      SELECT u.id::text, login FROM users u
      JOIN confirmations ON "u"."confirmationId" = "confirmations"."id"
      WHERE "isConfirmed" = true
      ORDER BY u.id
      LIMIT ${pageSize}
      OFFSET ${(pageNumber - 1) * pageSize}
    `);
  }

  async getUserByLogin(login: string): Promise<UserDBType | null> {
    const user = await this.userRepository.query(`
    select to_json(res) from 
    (
      select u.*, to_json(c) "emailConfirmation"
      from users u 
      inner join confirmations c 
      on "u"."confirmationId" = "c"."id"
      where login = '${login}'
    ) res;
    `);
    return JSON.parse(JSON.stringify(user))[0]?.to_json;
  }

  async getUserByLoginOrEmail(
    login: string,
    email: string,
  ): Promise<UserDBType | null> {
    const user: UserDBType | null = await this.userRepository.query(`
      SELECT id, login FROM users
      WHERE login = '${login}' OR email = '${email}'
        `);
    return user[0];
  }

  async getManyUsersByIds(ids: string[]): Promise<UserViewType[]> {
    if (!ids.length) {
      return [];
    }
    const users = await this.userRepository.query(`
      SELECT id, login FROM users
      WHERE id IN (${ids.join(',')})
    `);

    return users;
  }

  async getUserByEmail(email: string): Promise<UserDBType | null> {
    const user: UserDBType[] = await this.userRepository.query(`
      SELECT id, login FROM users
      WHERE email = '${email}'
    `);

    if (!user.length) {
      return null;
    }
    return user[0];
  }

  async getTotalCount(): Promise<number> {
    const result = await this.userRepository.query(`
      SELECT COUNT(*) FROM users
    `);
    return result[0].count;
  }

  async updateUserById(user: Partial<UserDBType>): Promise<boolean> {
    const { id } = user;
    const updatedUser = await this.userRepository.query(`
      UPDATE users SET ${Object.keys(user)
        .map((key) => `"${key}" = '${user[key]}'`)
        .join(', ')}
        WHERE id = '${id}'`);
    return updatedUser;
  }

  async getUserByConfirmationCode(
    confirmationCode: string,
  ): Promise<UserDBType | null> {
    const user: UserDBType[] = await this.userRepository.query(`
      SELECT id, login FROM users u
      JOIN confirmations ON "u"."confirmationId" = "confirmations"."id"
      WHERE "confirmationCode" = '${confirmationCode}'
      `);
    if (!user) {
      return null;
    }
    return user[0];
  }

  async getUserById(id: string): Promise<UserDBType | null> {
    const user: UserDBType[] = await this.userRepository.query(`
      SELECT id::text, login FROM users
      WHERE id = '${id}'
    `);
    if (!user) {
      return null;
    }
    return user[0];
  }

  async deleteUserById(id: string): Promise<boolean> {
    const deletedUser = await this.userRepository.query(`
      DELETE FROM users WHERE id = '${id}'
    `);
    return deletedUser[1] === 1;
  }

  async deleteAllUsers(): Promise<any> {
    return await this.userRepository.query(`DELETE FROM users`);
  }

  async createUser(user: UserDBType): Promise<any> {
    const { emailConfirmation, ...userEntity } = user;
    const conclusion = await this.userRepository
      .query(`WITH confirm AS (INSERT INTO confirmations ("confirmationCode", "expirationDate", "isConfirmed")
      VALUES ('${
        emailConfirmation.confirmationCode
      }', '${emailConfirmation.expirationDate.toUTCString()}', ${
      emailConfirmation.isConfirmed
    })
	  RETURNING id)
      INSERT INTO users ("login", "hashPassword", "email", "tokenVersion", "confirmationId")
      VALUES ('${userEntity.login}', '${userEntity.hashPassword}', '${
      userEntity.email
    }', ${
      userEntity.tokenVersion
    }, (select id from confirm)) RETURNING id::text, login;`);
    return conclusion[0];
  }
}
