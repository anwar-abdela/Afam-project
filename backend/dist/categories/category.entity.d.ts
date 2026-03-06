import { Product } from '../products/product.entity';
export declare class Category {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    products: Product[];
}
