import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './product.dto';
export declare class ProductsController {
    private service;
    constructor(service: ProductsService);
    findAll(archived?: string): Promise<import("./product.entity").Product[]>;
    getLowStock(threshold?: string): Promise<import("./product.entity").Product[]>;
    findOne(id: string): Promise<import("./product.entity").Product>;
    create(dto: CreateProductDto, user: any): Promise<import("./product.entity").Product[]>;
    update(id: string, dto: UpdateProductDto, user: any): Promise<import("./product.entity").Product>;
    archive(id: string, user: any): Promise<import("./product.entity").Product>;
}
