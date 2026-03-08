import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto, UpdateProductDto } from './product.dto';
export declare class ProductsService {
    private repo;
    constructor(repo: Repository<Product>);
    findAll(includeArchived?: boolean): Promise<Product[]>;
    findOne(id: string): Promise<Product>;
    create(dto: CreateProductDto, owner?: any): Promise<Product[]>;
    update(id: string, dto: UpdateProductDto, currentUser?: any): Promise<Product>;
    archive(id: string, currentUser?: any): Promise<Product>;
    getLowStock(threshold?: number): Promise<Product[]>;
}
