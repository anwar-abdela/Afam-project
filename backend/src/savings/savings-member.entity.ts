import {
    Entity, PrimaryGeneratedColumn, Column, OneToMany,
} from 'typeorm';
import { SavingsContribution } from './savings-contribution.entity';

@Entity('savings_members')
export class SavingsMember {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100 })
    name: string;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @OneToMany(() => SavingsContribution, (c) => c.member)
    contributions: SavingsContribution[];
}
