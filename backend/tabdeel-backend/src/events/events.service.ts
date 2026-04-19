import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event, EventStatus, EventType } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { BaseService } from '../common/base.service';

@Injectable()
export class EventsService extends BaseService<Event> {
  constructor(
    @InjectRepository(Event)
    protected eventsRepository: Repository<Event>,
  ) {
    super(eventsRepository);
  }

  findAll(): Promise<Event[]> {
    return this.eventsRepository.find({
      relations: ['author', 'comments'],
      order: { startDate: 'ASC' },
    });
  }

  findUpcoming(): Promise<Event[]> {
    return this.eventsRepository.find({
      where: { status: EventStatus.UPCOMING },
      relations: ['author', 'comments'],
      order: { startDate: 'ASC' },
    });
  }

  findByType(type: EventType): Promise<Event[]> {
    return this.eventsRepository.find({
      where: { type },
      relations: ['author', 'comments'],
      order: { startDate: 'ASC' },
    });
  }

  findOne(id: number): Promise<Event | null> {
    return this.eventsRepository.findOne({
      where: { id },
      relations: ['author', 'comments', 'comments.author'],
    });
  }

  findByAuthor(authorId: number): Promise<Event[]> {
    return this.eventsRepository.find({
      where: { authorId },
      relations: ['author', 'comments'],
      order: { startDate: 'ASC' },
    });
  }

  create(createEventDto: CreateEventDto): Promise<Event> {
    const event = this.eventsRepository.create({
      ...createEventDto,
      startDate: new Date(createEventDto.startDate),
      endDate: new Date(createEventDto.endDate),
    });
    return this.eventsRepository.save(event);
  }

  async update(id: number, updateData: Partial<CreateEventDto>): Promise<Event | null> {
    const updatePayload: any = { ...updateData };
    if (updateData.startDate) {
      updatePayload.startDate = new Date(updateData.startDate);
    }
    if (updateData.endDate) {
      updatePayload.endDate = new Date(updateData.endDate);
    }

    await this.eventsRepository.update(id, updatePayload);
    return this.findOne(id);
  }
}