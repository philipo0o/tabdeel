import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ServiceType {
    MAINTENANCE = 'maintenance',
    SHARING = 'sharing',
    ACCESSORIES = 'accessories',
    TRAINING = 'training',
    SALES = 'sales',
    GARAGE = 'garage',
}

@Entity()
export class Service {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @Column({
        type: 'enum',
        enum: ServiceType,
    })
    type: ServiceType;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
