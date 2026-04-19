import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Article } from '../../articles/entities/article.entity';
import { Event } from '../../events/entities/event.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => User, user => user.comments)
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column()
  authorId: number;

  // Optional relationships - a comment can belong to either an article or an event
  @ManyToOne(() => Article, article => article.comments, { nullable: true })
  @JoinColumn({ name: 'articleId' })
  article?: Article;

  @Column({ nullable: true })
  articleId?: number;

  @ManyToOne(() => Event, event => event.comments, { nullable: true })
  @JoinColumn({ name: 'eventId' })
  event?: Event;

  @Column({ nullable: true })
  eventId?: number;
}