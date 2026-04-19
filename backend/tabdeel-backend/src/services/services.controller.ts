import { Controller, Get, Post, Delete, Body, Param, UseGuards, Put, Query } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ServiceType } from './entities/service.entity';

@Controller('api/services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) { }

    @Get()
    findAll(@Query('type') type?: ServiceType) {
        if (type) {
            return this.servicesService.findByType(type);
        }
        return this.servicesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.servicesService.findOne(+id);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() createServiceDto: CreateServiceDto) {
        return this.servicesService.create(createServiceDto);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    update(@Param('id') id: string, @Body() updateServiceDto: Partial<CreateServiceDto>) {
        return this.servicesService.update(+id, updateServiceDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string) {
        return this.servicesService.remove(+id);
    }
}
