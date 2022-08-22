import { PartialType } from '@nestjs/mapped-types';
import { CreateBloggerDto } from './create-blogger.dto';
import {
  IsNotEmpty,
  Matches,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsNotBlank } from '../../../decorators/validate.decorator';

export class UpdateBloggerDto extends PartialType(CreateBloggerDto) {
  @IsNotEmpty({ message: 'should be not empty' })
  @IsNotBlank('', { message: 'should be not blank' })
  @MinLength(1)
  @MaxLength(15)
  readonly name: string;
  @IsOptional()
  @IsNotEmpty({ message: 'youtubeUrl should be not empty' })
  @MaxLength(100)
  @Matches(RegExp(/^https:\/\/[a-zA-Z0-9_-]+.[a-z]+[\/a-zA-Z0-9_-]/m), {
    message: 'URL Not Valid',
  })
  readonly youtubeUrl: string;
}
