import {
    Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne, JoinColumn
} from 'typeorm';
import { Sale } from '../sales/sale.entity';
import { Category } from '../categories/category.entity';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 200 })
    name: string;

    @Column({ length: 100, unique: true })
    sku: string;

    @ManyToOne(() => Category, category => category.products, { nullable: true, onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @Column({ type: 'int', default: 0 })
    quantity: number;

    @Column({ type: 'numeric', precision: 12, scale: 2, name: 'purchase_price' })
    purchasePrice: number;

    @Column({ type: 'numeric', precision: 12, scale: 2, name: 'selling_price' })
    sellingPrice: number;

    @Column({ name: 'is_archived', default: false })
    isArchived: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamptz', default: () => 'NOW()' })
    updatedAt: Date;

    @OneToMany(() => Sale, (sale) => sale.product)
    sales: Sale[];
}
