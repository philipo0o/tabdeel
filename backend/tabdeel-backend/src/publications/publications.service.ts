import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Publication, PublicationType } from './entities/publication.entity';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { BaseService } from '../common/base.service';

@Injectable()
export class PublicationsService extends BaseService<Publication> {
  constructor(
    @InjectRepository(Publication)
    protected publicationsRepository: Repository<Publication>,
  ) {
    super(publicationsRepository);
  }

  findAll(): Promise<Publication[]> {
    return this.publicationsRepository.find({
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  findPublished(): Promise<Publication[]> {
    return this.publicationsRepository.find({
      where: { isPublished: true },
      relations: ['author'],
      order: { publishedAt: 'DESC' },
    });
  }

  findByType(type: PublicationType): Promise<Publication[]> {
    return this.publicationsRepository.find({
      where: { type, isPublished: true },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: number): Promise<Publication | null> {
    return super.findOne(id, ['author']);
  }

  async create(createPublicationDto: CreatePublicationDto): Promise<Publication> {
    const publication = this.publicationsRepository.create(createPublicationDto);
    if (publication.isPublished) {
      publication.publishedAt = new Date();
    }
    return this.publicationsRepository.save(publication);
  }

  async incrementDownloadCount(id: number): Promise<void> {
    await this.incrementField(id, 'downloadCount', 1);
  }

  async update(id: number, updateData: Partial<CreatePublicationDto>): Promise<Publication | null> {
    const publication = await this.findOne(id);
    if (!publication) return null;

    const updatePayload: any = { ...updateData };
    if (updateData.isPublished && !publication.isPublished) {
      updatePayload.publishedAt = new Date();
    }

    await this.publicationsRepository.update(id, updatePayload);
    return this.findOne(id);
  }
}