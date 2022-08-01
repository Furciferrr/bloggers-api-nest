import {
  Body,
  Controller,
  Post,
  BadRequestException,
  Res,
  HttpException,
  HttpStatus,
  Get,
  Req,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { Request, Response } from 'express';
import { Cookies } from 'src/decorators/cookie.decorator';
import { User } from 'src/decorators/user.decorator';
import { CreateUserDto } from 'src/features/users/dto/createUser.dto';
import { UsersService } from 'src/features/users/users.service';
import { AuthService } from './auth.service';
import { ConfirmEmailDto, LoginUserDto, ResendEmailDto } from './dto/index.dto';
import { MailSender } from 'src/adapters/email-adapter';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
    private readonly mailSender: MailSender,
  ) {}

  @Post('/registration')
  @UseGuards(ThrottlerGuard)
  async registrationUser(@Body() body: CreateUserDto) {
    const result = await this.userService.createUser(body);
    if (result.resultCode === 0) {
      try {
        await this.mailSender.sendEmail(
          result.result.email,
          `code=${result.result.emailConfirmation.confirmationCode}`,
        );
      } catch (error) {
        console.error('service', error);
        await this.userService.deleteUserById(result.result.id);
        throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
      }
      return;
    } else {
      throw new BadRequestException(result.errorsMessages);
    }
  }

  @Post('/login')
  @UseGuards(ThrottlerGuard)
  async login(
    @Body() body: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const checkResult = await this.userService.checkCredentials(
      body.login,
      body.password,
    );
    if (checkResult.resultCode === 0) {
      response.cookie('refreshToken', checkResult.data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });
      return { accessToken: checkResult.data.accessToken };
    } else {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('/registration-confirmation')
  @UseGuards(ThrottlerGuard)
  async confirmation(@Body() body: ConfirmEmailDto) {
    const result = await this.userService.confirmEmail(body.code);
    if (result) {
      return;
    } else {
      throw new BadRequestException([
        { message: 'code not valid', field: 'code' },
      ]);
    }
  }

  @Post('/registration-email-resending')
  //@UsePipes(CountAttemptGuard)
  @UseGuards(ThrottlerGuard)
  async resendingEmail(@Body() body: ResendEmailDto) {
    const result = await this.authService.resendingEmail(body.email);
    if (result.resultCode === 0) {
      return;
    } else {
      throw new BadRequestException(result.errorsMessages);
    }
  }

  @Post('/refresh-token')
  async refreshToken(
    @Cookies('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.refreshToken(refreshToken);
    if (result.resultCode === 1) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }
    response.cookie('refreshToken', result.data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    return { accessToken: result.data.accessToken };
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  async me(@User('id') userId: string) {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    }
    return {
      login: user.login,
      userId: user.id,
    };
  }

  @Post('/logout')
  @HttpCode(204)
  async logout(@Req() request: Request) {
    const result = await this.authService.logout(request.cookies.refreshToken);
    if (result.resultCode === 0) {
      delete request.cookies;
    } else {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }
  }
}
