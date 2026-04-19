import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum ContentCategory {
  ARTICLE = 'article',
  EVENT = 'event',
  CULTURE = 'culture',
  SERVICE = 'service',
}

@Entity()
export class Content {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  body: string;

  @Column()
  dateLabel: string;

  @Column({
    type: 'enum',
    enum: ContentCategory,
  })
  category: ContentCategory;
}