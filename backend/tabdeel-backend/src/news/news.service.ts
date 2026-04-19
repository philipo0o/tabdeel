import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News, NewsCategory } from './entities/news.entity';
import { CreateNewsDto } from './dto/create-news.dto';
import { BaseService } from '../common/base.service';

@Injectable()
export class NewsService extends BaseService<News> {
  constructor(
    @InjectRepository(News)
    protected newsRepository: Repository<News>,
  ) {
    super(newsRepository);
  }

  findAll(): Promise<News[]> {
    return this.newsRepository.find({
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  findPublished(): Promise<News[]> {
    return this.newsRepository.find({
      where: { isPublished: true },
      relations: ['author'],
      order: { publishedAt: 'DESC' },
    });
  }

  findByCategory(category: NewsCategory): Promise<News[]> {
    return this.newsRepository.find({
      where: { category, isPublished: true },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: number): Promise<News | null> {
    return super.findOne(id, ['author']);
  }

  async create(createNewsDto: CreateNewsDto): Promise<News> {
    const news = this.newsRepository.create(createNewsDto);
    if (news.isPublished) {
      news.publishedAt = new Date();
    }
    return this.newsRepository.save(news);
  }

  async incrementViewCount(id: number): Promise<void> {
    await this.incrementField(id, 'viewCount', 1);
  }

  async update(id: number, updateData: Partial<CreateNewsDto>): Promise<News | null> {
    const news = await this.findOne(id);
    if (!news) return null;

    const updatePayload: any = { ...updateData };
    if (updateData.isPublished && !news.isPublished) {
      updatePayload.publishedAt = new Date();
    }

    await this.newsRepository.update(id, updatePayload);
    return this.findOne(id);
  }
}