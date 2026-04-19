import { IsString, IsEnum, IsOptional, IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';
import { AlbumCategory } from '../entities/album.entity';

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  titleEn: string;

  @IsString()
  @IsNotEmpty()
  titleAr: string;

  @IsString()
  @IsOptional()
  descriptionEn?: string;

  @IsString()
  @IsOptional()
  descriptionAr?: string;

  @IsEnum(AlbumCategory)
  category: AlbumCategory;

  @IsString()
  @IsOptional()
  coverPhoto?: string;

  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @IsNumber()
  authorId: number;
}