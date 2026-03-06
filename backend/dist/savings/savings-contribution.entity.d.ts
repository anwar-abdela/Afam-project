import { SavingsMember } from './savings-member.entity';
export declare class SavingsContribution {
    id: string;
    member: SavingsMember;
    memberId: string;
    amount: number;
    date: string;
    isMissed: boolean;
}
