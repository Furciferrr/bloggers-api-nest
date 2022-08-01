import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';
import { IsNotBlank } from 'src/decorators/validate.decorator';

export class CreateBloggerDto {
  @IsNotEmpty({ message: 'name field is required' })
  @IsNotBlank('', { message: 'should be not blank' })
  @MinLength(1)
  @MaxLength(15)
  readonly name: string;
  @IsNotEmpty({ message: 'youtubeUrl is field required' })
  @MaxLength(100)
  @Matches(RegExp(/^https:\/\/[a-zA-Z0-9_-]+.[a-z]+[\/a-zA-Z0-9_-]/m), {
    message: 'URL Not Valid',
  })
  readonly youtubeUrl: string;
}
