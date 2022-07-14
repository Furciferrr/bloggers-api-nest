import {
  Body,
  Controller,
  Post,
  BadRequestException,
  Res,
  HttpException,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { Response } from 'express';
import { Cookies } from 'src/decorators/cookie.decorator';
import { User } from 'src/decorators/user.decorator';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { ConfirmEmailDto, LoginUserDto, ResendEmailDto } from './dto/index.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('/registration')
  async registrationUser(@Body() body: CreateUserDto) {
    const result = await this.userService.createUser(body);
    if (result.resultCode === 0) {
      return;
    } else {
      throw new BadRequestException(result.errorsMessages);
    }
  }

  @Post('/login')
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
  async resendingEmail(@Body() body: ResendEmailDto) {
    const result = await this.authService.resendingEmail(body.email);
    if (result.resultCode === 0) {
      return;
    } else {
      throw new BadRequestException(result.errorsMessages);
    }
  }

  @Post('/logout')
  async refreshToken(
    @Cookies('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    //const result = await this.authService.refreshToken(refreshToken);
    const result = {
      resultCode: 0,
      data: {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      },
    };
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
  async me(@User('id') userId: string) {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new HttpException('NOT FOUND', HttpStatus.NOT_FOUND);
    }
    return {
      //email: user.email,
      login: user.login,
      userId: user.id,
    };
  }

  async logout(req: Request, res: Response) {
    //const result = await this.authService.logout(req.cookies.refreshToken);
    const result = {
      resultCode: 0,
      data: {
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      },
    };
    if (result.resultCode === 0) {
      return res.clearCookie('refreshToken').sendStatus(204);
    } else {
      return res.sendStatus(401);
    }
  }
}
