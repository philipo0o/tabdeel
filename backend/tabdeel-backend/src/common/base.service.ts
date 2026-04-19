import { Repository, FindOptionsWhere, FindManyOptions, DeepPartial, ObjectLiteral } from 'typeorm';

/**
 * Base service providing common CRUD operations for all entities
 * Reduces code duplication across service classes
 */
export abstract class BaseService<T extends ObjectLiteral> {
    constructor(protected readonly repository: Repository<T>) { }

    /**
     * Find all entities with optional relations and ordering
     */
    async findAll(options?: FindManyOptions<T>): Promise<T[]> {
        return this.repository.find(options);
    }

    /**
     * Find a single entity by ID
     */
    async findOne(id: number, relations?: string[]): Promise<T | null> {
        const options: any = { where: { id: id as any } };
        if (relations) {
            options.relations = relations;
        }
        return this.repository.findOne(options);
    }

    /**
     * Create a new entity
     */
    async create(createDto: DeepPartial<T>): Promise<T> {
        const entity = this.repository.create(createDto);
        return this.repository.save(entity);
    }

    /**
     * Update an existing entity
     */
    async update(id: number, updateDto: DeepPartial<T>): Promise<T | null> {
        await this.repository.update(id, updateDto as any);
        return this.findOne(id);
    }

    /**
     * Delete an entity by ID
     */
    async remove(id: number): Promise<void> {
        await this.repository.delete(id);
    }

    /**
     * Increment a numeric field
     */
    async incrementField(id: number, field: string, value: number = 1): Promise<void> {
        await this.repository.increment({ id: id as any }, field, value);
    }

    /**
     * Count entities matching criteria
     */
    async count(where?: FindOptionsWhere<T>): Promise<number> {
        return this.repository.count({ where });
    }
}
