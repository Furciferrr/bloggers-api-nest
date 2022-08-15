import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { IsNotBlank } from '../../../decorators/validate.decorator';

export class CreateCommentDto {
  @IsNotEmpty({ message: 'content field is required' })
  @IsNotBlank('', { message: 'should be not blank' })
  @MinLength(20)
  @MaxLength(300)
  readonly content: string;
}
