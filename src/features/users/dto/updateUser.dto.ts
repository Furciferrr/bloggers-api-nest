import { IsNotEmpty } from 'class-validator';
import { IsNotBlank } from '../../../decorators/validate.decorator';

export class LoginUserDto {
  @IsNotEmpty({ message: 'username field is required' })
  @IsNotBlank('', { message: 'should be not blank' })
  readonly login: string;
  //@IsOptional()
  //@IsEmail({ message: "not valid email" })
  //readonly email: string;
  @IsNotEmpty({ message: 'password field is required' })
  @IsNotBlank('', { message: 'should be not blank' })
  readonly password: string;
}
