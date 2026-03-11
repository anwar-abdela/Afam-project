import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';
export declare class Sale {
    id: string;
    product: Product;
    productId: string;
    user: User;
    userId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    profit: number;
    saleDate: Date;
}
