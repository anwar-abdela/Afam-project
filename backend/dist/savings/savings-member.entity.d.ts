import { SavingsContribution } from './savings-contribution.entity';
export declare class SavingsMember {
    id: string;
    name: string;
    isActive: boolean;
    contributions: SavingsContribution[];
}
