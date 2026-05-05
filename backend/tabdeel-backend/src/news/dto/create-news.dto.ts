import { IsString, IsEnum, IsOptional, IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';
import { NewsCategory } from '../entities/news.entity';

export class CreateNewsDto {
  @IsString()
  @IsNotEmpty()
  titleEn: string;

  @IsString()
  @IsNotEmpty()
  titleAr: string;

  @IsString()
  @IsOptional()
  contentEn?: string;

  @IsString()
  @IsOptional()
  contentAr?: string;

  @IsEnum(NewsCategory)
  category: NewsCategory;

  @IsString()
  @IsOptional()
  featuredImage?: string;

  @IsString()
  @IsOptional()
  fileAttachment?: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @IsNumber()
  authorId: number;
}