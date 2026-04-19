import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album, AlbumCategory } from './entities/album.entity';
import { AlbumPhoto } from './entities/album-photo.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { CreateAlbumPhotoDto } from './dto/create-album-photo.dto';
import { BaseService } from '../common/base.service';

@Injectable()
export class AlbumsService extends BaseService<Album> {
  constructor(
    @InjectRepository(Album)
    protected albumsRepository: Repository<Album>,
    @InjectRepository(AlbumPhoto)
    private albumPhotosRepository: Repository<AlbumPhoto>,
  ) {
    super(albumsRepository);
  }

  // Override findAll to include relations and ordering
  findAll(): Promise<Album[]> {
    return this.albumsRepository.find({
      relations: ['author', 'photos'],
      order: { createdAt: 'DESC' },
    });
  }

  // Album-specific query methods
  findPublished(): Promise<Album[]> {
    return this.albumsRepository.find({
      where: { isPublished: true },
      relations: ['author', 'photos'],
      order: { createdAt: 'DESC' },
    });
  }

  findByCategory(category: AlbumCategory): Promise<Album[]> {
    return this.albumsRepository.find({
      where: { category, isPublished: true },
      relations: ['author', 'photos'],
      order: { createdAt: 'DESC' },
    });
  }

  // Override findOne to include relations
  findOne(id: number): Promise<Album | null> {
    return super.findOne(id, ['author', 'photos']);
  }

  // Use inherited incrementField method for view count
  async incrementViewCount(id: number): Promise<void> {
    await this.incrementField(id, 'viewCount', 1);
  }

  // Album Photos methods
  async addPhoto(createPhotoDto: CreateAlbumPhotoDto): Promise<AlbumPhoto> {
    const photo = this.albumPhotosRepository.create(createPhotoDto);
    return this.albumPhotosRepository.save(photo);
  }

  async getAlbumPhotos(albumId: number): Promise<AlbumPhoto[]> {
    return this.albumPhotosRepository.find({
      where: { albumId },
      order: { order: 'ASC', createdAt: 'ASC' },
    });
  }

  async removePhoto(photoId: number): Promise<void> {
    await this.albumPhotosRepository.delete(photoId);
  }
}