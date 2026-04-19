import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service, ServiceType } from './entities/service.entity';
import { BaseService } from '../common/base.service';

@Injectable()
export class ServicesService extends BaseService<Service> {
    constructor(
        @InjectRepository(Service)
        private servicesRepository: Repository<Service>,
    ) {
        super(servicesRepository);
    }

    /**
     * Find all services of a given type
     */
    async findByType(type: ServiceType): Promise<Service[]> {
        return this.servicesRepository.find({
            where: { type },
            order: { createdAt: 'DESC' },
        });
    }
}
