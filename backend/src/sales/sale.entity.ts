import {
    Entity, PrimaryGeneratedColumn, Column, ManyToOne,
    JoinColumn, CreateDateColumn,
} from 'typeorm';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';

@Entity('sales')
export class Sale {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Product, (product) => product.sales, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column({ name: 'product_id' })
    productId: string;

    @ManyToOne(() => User, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'user_id', nullable: true })
    userId: string;

    @Column({ type: 'int' })
    quantity: number;

    @Column({ type: 'numeric', precision: 12, scale: 2, name: 'unit_price' })
    unitPrice: number;

    @Column({ type: 'numeric', precision: 14, scale: 2, name: 'total_price' })
    totalPrice: number;

    @Column({ type: 'numeric', precision: 14, scale: 2 })
    profit: number;

    @CreateDateColumn({ name: 'sale_date' })
    saleDate: Date;
}
