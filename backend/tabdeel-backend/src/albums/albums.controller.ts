import { Controller, Get, Post, Delete, Body, Param, UseGuards, Put, Query, Patch } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { CreateAlbumPhotoDto } from './dto/create-album-photo.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AlbumCategory } from './entities/album.entity';

@Controller('api/albums')
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  findAll(@Query('category') category?: AlbumCategory) {
    if (category) {
      return this.albumsService.findByCategory(category);
    }
    return this.albumsService.findAll();
  }

  @Get('published')
  findPublished() {
    return this.albumsService.findPublished();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const album = await this.albumsService.findOne(+id);
    if (album) {
      await this.albumsService.incrementViewCount(+id);
    }
    return album;
  }

  @Get(':id/photos')
  getAlbumPhotos(@Param('id') id: string) {
    return this.albumsService.getAlbumPhotos(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumsService.create(createAlbumDto);
  }

  @Post('photos')
  @UseGuards(JwtAuthGuard)
  addPhoto(@Body() createPhotoDto: CreateAlbumPhotoDto) {
    return this.albumsService.addPhoto(createPhotoDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateAlbumDto: Partial<CreateAlbumDto>) {
    return this.albumsService.update(+id, updateAlbumDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.albumsService.remove(+id);
  }

  @Delete('photos/:photoId')
  @UseGuards(JwtAuthGuard)
  removePhoto(@Param('photoId') photoId: string) {
    return this.albumsService.removePhoto(+photoId);
  }
}