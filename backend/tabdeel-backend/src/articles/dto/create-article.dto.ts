import { IsString, IsEnum, IsOptional, IsNotEmpty, IsArray, IsNumber } from 'class-validator';
import { ArticleStatus } from '../entities/article.entity';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  excerpt?: string;

  @IsString()
  @IsOptional()
  featuredImage?: string;

  @IsString()
  @IsOptional()
  fileAttachment?: string;

  @IsEnum(ArticleStatus)
  @IsOptional()
  status?: ArticleStatus;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsNumber()
  authorId: number;
}