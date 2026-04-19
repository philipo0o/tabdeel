import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAlbumPhotoDto {
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsString()
  @IsOptional()
  captionEn?: string;

  @IsString()
  @IsOptional()
  captionAr?: string;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsNumber()
  albumId: number;
}