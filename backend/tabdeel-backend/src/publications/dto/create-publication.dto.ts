import { IsString, IsEnum, IsOptional, IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';
import { PublicationType } from '../entities/publication.entity';

export class CreatePublicationDto {
  @IsString()
  @IsNotEmpty()
  titleEn: string;

  @IsString()
  @IsNotEmpty()
  titleAr: string;

  @IsString()
  @IsNotEmpty()
  descriptionEn: string;

  @IsString()
  @IsNotEmpty()
  descriptionAr: string;

  @IsEnum(PublicationType)
  type: PublicationType;

  @IsString()
  @IsOptional()
  fileUrl?: string;

  @IsString()
  @IsOptional()
  coverImage?: string;

  @IsString()
  @IsOptional()
  pdfUrl?: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @IsNumber()
  authorId: number;
}