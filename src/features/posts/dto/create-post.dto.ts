import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { IsNotBlank } from '../../../decorators/validate.decorator';

export class CreatePostDto {
  @IsNotEmpty({ message: 'title field is required' })
  @IsNotBlank('', { message: 'should be not blank' })
  @MinLength(1)
  @MaxLength(30)
  readonly title: string;
  @IsNotEmpty({ message: 'shortDescription field is required' })
  @MinLength(1)
  @MaxLength(100)
  readonly shortDescription: string;
  @IsNotBlank('', { message: 'should be not blank' })
  @IsNotEmpty({ message: 'content field is required' })
  @MinLength(1)
  @MaxLength(1000)
  readonly content: string;
  @IsNotEmpty({ message: 'bloggerId field is required' })
  readonly bloggerId: string;
}
