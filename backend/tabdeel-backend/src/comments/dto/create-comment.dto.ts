import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  authorId: number;

  @IsNumber()
  @IsOptional()
  articleId?: number;

  @IsNumber()
  @IsOptional()
  eventId?: number;
}