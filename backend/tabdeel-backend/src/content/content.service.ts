import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content } from './entities/content.entity';
import { CreateContentDto } from './dto/create-content.dto';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private contentRepository: Repository<Content>,
  ) {}

  findAll(): Promise<Content[]> {
    return this.contentRepository.find();
  }

  findOne(id: number): Promise<Content | null> {
    return this.contentRepository.findOne({ where: { id } });
  }

  findByCategory(category: string): Promise<Content[]> {
    return this.contentRepository.find({ where: { category: category as any } });
  }

  create(createContentDto: CreateContentDto): Promise<Content> {
    const content = this.contentRepository.create(createContentDto);
    return this.contentRepository.save(content);
  }

  async remove(id: number): Promise<void> {
    await this.contentRepository.delete(id);
  }
}