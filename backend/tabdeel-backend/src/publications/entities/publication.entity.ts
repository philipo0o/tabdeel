import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum PublicationType {
  GUIDE = 'guide',
  MAP = 'map',
  MANUAL = 'manual',
  REPORT = 'report',
  BROCHURE = 'brochure',
}

@Entity()
export class Publication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titleEn: string;

  @Column()
  titleAr: string;

  @Column('text')
  descriptionEn: string;

  @Column('text')
  descriptionAr: string;

  @Column({
    type: 'enum',
    enum: PublicationType,
  })
  type: PublicationType;

  @Column({ nullable: true })
  fileUrl?: string;

  @Column({ nullable: true })
  coverImage?: string;

  @Column({ nullable: true })
  pdfUrl?: string;

  @Column({ default: 0 })
  downloadCount: number;

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