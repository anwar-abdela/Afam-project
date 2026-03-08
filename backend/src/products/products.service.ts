import {
    Injectable, NotFoundException, BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto, UpdateProductDto } from './product.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product) private repo: Repository<Product>,
    ) { }

    async findAll(includeArchived = false) {
        return this.repo.find({
            where: includeArchived ? {} : { isArchived: false },
            order: { createdAt: 'DESC' },
            relations: ['category', 'owner']
        });
    }

    async findOne(id: string) {
        const product = await this.repo.findOne({ where: { id }, relations: ['category'] });
        if (!product) throw new NotFoundException(`Product ${id} not found`);
        return product;
    }

    async create(dto: CreateProductDto, owner?: any) {
        const existing = await this.repo.findOne({ where: { sku: dto.sku } });
        if (existing) throw new BadRequestException('SKU already exists');

        let productData: any = { ...dto };
        if (dto.categoryId !== undefined) {
            productData.category = dto.categoryId ? { id: dto.categoryId } : null;
            delete productData.categoryId;
        }

        if (owner) {
            productData.owner = { id: owner.id };
        }

        const product = this.repo.create(productData);
        return this.repo.save(product);
    }

    async update(id: string, dto: UpdateProductDto, currentUser?: any) {
        const product = await this.repo.findOne({ where: { id }, relations: ['owner'] });
        if (!product) throw new NotFoundException(`Product ${id} not found`);

        const isAdmin = currentUser?.role === 'admin';
        const isOwner = product.owner?.id === currentUser?.id;

        if (!isAdmin && !isOwner) {
            throw new BadRequestException('Unauthorized: You do not own this product');
        }

        let updateData: any = { ...dto };
        if (dto.categoryId !== undefined) {
            updateData.category = dto.categoryId ? { id: dto.categoryId } : null;
            delete updateData.categoryId;
        }

        Object.assign(product, updateData);
        return this.repo.save(product);
    }

    async archive(id: string, currentUser?: any) {
        const product = await this.repo.findOne({ where: { id }, relations: ['owner'] });
        if (!product) throw new NotFoundException(`Product ${id} not found`);

        const isAdmin = currentUser?.role === 'admin';
        const isOwner = product.owner?.id === currentUser?.id;

        if (!isAdmin && !isOwner) {
            throw new BadRequestException('Unauthorized: You do not own this product');
        }

        product.isArchived = true;
        return this.repo.save(product);
    }

    async getLowStock(threshold = 5) {
        return this.repo
            .createQueryBuilder('p')
            .where('p.quantity <= :threshold', { threshold })
            .andWhere('p.is_archived = false')
            .getMany();
    }
}
