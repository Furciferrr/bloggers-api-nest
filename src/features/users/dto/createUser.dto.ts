import { IsNotEmpty, MaxLength, MinLength, IsEmail } from 'class-validator';
import { IsNotBlank } from 'src/decorators/validate.decorator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'username field is required' })
  @IsNotBlank('', { message: 'should be not blank' })
  @MinLength(3)
  @MaxLength(10)
  readonly login: string;
  @IsEmail({ message: 'not valid email' })
  readonly email: string;
  @IsNotEmpty({ message: 'password field is required' })
  @IsNotBlank('', { message: 'should be not blank' })
  @MinLength(6)
  @MaxLength(20)
  readonly password: string;
}
