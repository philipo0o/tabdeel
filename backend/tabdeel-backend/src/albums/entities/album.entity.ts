import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { AlbumPhoto } from './album-photo.entity';

export enum AlbumCategory {
  BIKES = 'bikes',
  ROUTES = 'routes',
  EVENTS = 'events',
  MEMBERS = 'members',
  GENERAL = 'general',
}

@Entity()
export class Album {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titleEn: string;

  @Column()
  titleAr: string;

  @Column('text', { nullable: true })
  descriptionEn?: string;

  @Column('text', { nullable: true })
  descriptionAr?: string;

  @Column({
    type: 'enum',
    enum: AlbumCategory,
  })
  category: AlbumCategory;

  @Column({ nullable: true })
  coverPhoto?: string;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: true })
  isPublished: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column()
  authorId: number;

  @OneToMany(() => AlbumPhoto, photo => photo.album)
  photos: AlbumPhoto[];
}