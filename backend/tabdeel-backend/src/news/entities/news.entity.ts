import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum NewsCategory {
  BREAKING = 'breaking',
  NEW = 'new',
  EVENT = 'event',
  UPDATE = 'update',
  ANNOUNCEMENT = 'announcement',
}

@Entity()
export class News {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titleEn: string;

  @Column()
  titleAr: string;

  @Column({ type: 'text', nullable: true })
  contentEn?: string;

  @Column({ type: 'text', nullable: true })
  contentAr?: string;

  @Column({
    type: 'enum',
    enum: NewsCategory,
  })
  category: NewsCategory;

  @Column({ nullable: true })
  featuredImage?: string;

  @Column({ nullable: true })
  fileAttachment?: string;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: true })
  isPublished: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  publishedAt?: Date;

  // Relationships
  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column()
  authorId: number;
}