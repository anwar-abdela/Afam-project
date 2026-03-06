import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private categoriesRepository: Repository<Category>,
    ) { }

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const existingCategory = await this.categoriesRepository.findOne({
            where: { name: createCategoryDto.name },
        });

        if (existingCategory) {
            throw new ConflictException('Category with this name already exists');
        }

        const category = this.categoriesRepository.create(createCategoryDto);
        return await this.categoriesRepository.save(category);
    }

    async findAll(): Promise<Category[]> {
        return await this.categoriesRepository.find({
            relations: ['products'],
        });
    }

    async findOne(id: string): Promise<Category> {
        const category = await this.categoriesRepository.findOne({ where: { id } });
        if (!category) {
            throw new NotFoundException(`Category with ID "${id}" not found`);
        }
        return category;
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
        const category = await this.findOne(id);

        if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
            const existing = await this.categoriesRepository.findOne({
                where: { name: updateCategoryDto.name },
            });
            if (existing) {
                throw new ConflictException('Category with this name already exists');
            }
        }

        Object.assign(category, updateCategoryDto);
        return await this.categoriesRepository.save(category);
    }

    async remove(id: string): Promise<void> {
        const category = await this.categoriesRepository.findOne({
            where: { id },
            relations: ['products'],
        });

        if (!category) {
            throw new NotFoundException(`Category with ID "${id}" not found`);
        }

        if (category.products && category.products.length > 0) {
            throw new BadRequestException('Cannot delete category because it has linked products.');
        }

        await this.categoriesRepository.remove(category);
    }
}
