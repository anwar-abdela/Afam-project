import {
    Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn,
} from 'typeorm';
import { SavingsMember } from './savings-member.entity';

@Entity('savings_contributions')
export class SavingsContribution {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => SavingsMember, (m) => m.contributions, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'member_id' })
    member: SavingsMember;

    @Column({ name: 'member_id' })
    memberId: string;

    @Column({ type: 'numeric', precision: 12, scale: 2 })
    amount: number;

    @Column({ type: 'date', default: () => 'CURRENT_DATE' })
    date: string;

    @Column({ name: 'is_missed', default: false })
    isMissed: boolean;
}
