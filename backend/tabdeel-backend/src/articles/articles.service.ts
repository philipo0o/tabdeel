import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article, ArticleStatus } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { BaseService } from '../common/base.service';

@Injectable()
export class ArticlesService extends BaseService<Article> {
  constructor(
    @InjectRepository(Article)
    protected articlesRepository: Repository<Article>,
  ) {
    super(articlesRepository);
  }

  // Override findAll to include relations
  findAll(): Promise<Article[]> {
    return this.articlesRepository.find({
      relations: ['author', 'comments'],
      order: { createdAt: 'DESC' },
    });
  }

  // Article-specific query methods
  findPublished(): Promise<Article[]> {
    return this.articlesRepository.find({
      where: { status: ArticleStatus.PUBLISHED },
      relations: ['author', 'comments'],
      order: { publishedAt: 'DESC' },
    });
  }

  // Override findOne to include nested relations
  findOne(id: number): Promise<Article | null> {
    return this.articlesRepository.findOne({
      where: { id },
      relations: ['author', 'comments', 'comments.author'],
    });
  }

  findByAuthor(authorId: number): Promise<Article[]> {
    return this.articlesRepository.find({
      where: { authorId },
      relations: ['author', 'comments'],
      order: { createdAt: 'DESC' },
    });
  }

  // Override create to handle publishedAt
  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    const article = this.articlesRepository.create(createArticleDto);
    if (article.status === ArticleStatus.PUBLISHED) {
      article.publishedAt = new Date();
    }
    return this.articlesRepository.save(article);
  }

  async incrementViewCount(id: number): Promise<void> {
    await this.incrementField(id, 'viewCount', 1);
  }

  // Override update to handle status changes and publishedAt
  async update(id: number, updateData: Partial<CreateArticleDto>): Promise<Article | null> {
    const article = await this.findOne(id);
    if (!article) return null;

    const updatePayload: any = { ...updateData };
    if (updateData.status === ArticleStatus.PUBLISHED && article.status !== ArticleStatus.PUBLISHED) {
      updatePayload.publishedAt = new Date();
    }

    await this.articlesRepository.update(id, updatePayload);
    return this.findOne(id);
  }
}