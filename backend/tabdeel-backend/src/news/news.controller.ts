import { Controller, Get, Post, Delete, Body, Param, UseGuards, Put, Query } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NewsCategory } from './entities/news.entity';

@Controller('api/news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  findAll(@Query('category') category?: NewsCategory) {
    if (category) {
      return this.newsService.findByCategory(category);
    }
    return this.newsService.findAll();
  }

  @Get('published')
  findPublished() {
    return this.newsService.findPublished();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const news = await this.newsService.findOne(+id);
    if (news) {
      await this.newsService.incrementViewCount(+id);
    }
    return news;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createNewsDto: CreateNewsDto) {
    return this.newsService.create(createNewsDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateNewsDto: Partial<CreateNewsDto>) {
    return this.newsService.update(+id, updateNewsDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.newsService.remove(+id);
  }
}