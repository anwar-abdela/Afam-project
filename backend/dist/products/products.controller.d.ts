import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './product.dto';
export declare class ProductsController {
    private service;
    constructor(service: ProductsService);
    findAll(archived?: string): Promise<import("./product.entity").Product[]>;
    getLowStock(threshold?: string): Promise<import("./product.entity").Product[]>;
    findOne(id: string): Promise<import("./product.entity").Product>;
    create(dto: CreateProductDto): Promise<import("./product.entity").Product[]>;
    update(id: string, dto: UpdateProductDto): Promise<import("./product.entity").Product>;
    archive(id: string): Promise<import("./product.entity").Product>;
}
