import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  findAll(): Promise<Comment[]> {
    return this.commentsRepository.find({
      relations: ['author', 'article', 'event'],
      order: { createdAt: 'DESC' },
    });
  }

  findByArticle(articleId: number): Promise<Comment[]> {
    return this.commentsRepository.find({
      where: { articleId },
      relations: ['author'],
      order: { createdAt: 'ASC' },
    });
  }

  findByEvent(eventId: number): Promise<Comment[]> {
    return this.commentsRepository.find({
      where: { eventId },
      relations: ['author'],
      order: { createdAt: 'ASC' },
    });
  }

  findOne(id: number): Promise<Comment | null> {
    return this.commentsRepository.findOne({
      where: { id },
      relations: ['author', 'article', 'event'],
    });
  }

  create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const comment = this.commentsRepository.create(createCommentDto);
    return this.commentsRepository.save(comment);
  }

  async update(id: number, content: string): Promise<Comment | null> {
    await this.commentsRepository.update(id, { content });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.commentsRepository.delete(id);
  }
}