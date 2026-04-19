import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { ContentCategory } from '../entities/content.entity';

export class CreateContentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsString()
  @IsNotEmpty()
  dateLabel: string;

  @IsEnum(ContentCategory)
  @IsNotEmpty()
  category: ContentCategory;
}