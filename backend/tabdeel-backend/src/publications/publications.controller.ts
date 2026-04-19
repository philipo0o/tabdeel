import { Controller, Get, Post, Delete, Body, Param, UseGuards, Put, Query, Patch } from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PublicationType } from './entities/publication.entity';

@Controller('api/publications')
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @Get()
  findAll(@Query('type') type?: PublicationType) {
    if (type) {
      return this.publicationsService.findByType(type);
    }
    return this.publicationsService.findAll();
  }

  @Get('published')
  findPublished() {
    return this.publicationsService.findPublished();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.publicationsService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createPublicationDto: CreatePublicationDto) {
    return this.publicationsService.create(createPublicationDto);
  }

  @Patch(':id/download')
  async incrementDownload(@Param('id') id: string) {
    await this.publicationsService.incrementDownloadCount(+id);
    return { message: 'Download count incremented' };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updatePublicationDto: Partial<CreatePublicationDto>) {
    return this.publicationsService.update(+id, updatePublicationDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.publicationsService.remove(+id);
  }
}