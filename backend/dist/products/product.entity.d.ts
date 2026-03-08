import { Sale } from '../sales/sale.entity';
import { Category } from '../categories/category.entity';
import { User } from '../users/user.entity';
export declare class Product {
    id: string;
    name: string;
    sku: string;
    category: Category;
    quantity: number;
    purchasePrice: number;
    sellingPrice: number;
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
    owner: User;
    sales: Sale[];
}
