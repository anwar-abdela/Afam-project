import { Product } from '../products/product.entity';
export declare class Sale {
    id: string;
    product: Product;
    productId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    profit: number;
    saleDate: Date;
}
