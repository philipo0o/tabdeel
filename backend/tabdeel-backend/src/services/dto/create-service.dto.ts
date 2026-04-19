import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { ServiceType } from '../entities/service.entity';

export class CreateServiceDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsEnum(ServiceType)
    type: ServiceType;
}
