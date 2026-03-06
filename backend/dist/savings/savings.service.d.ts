import { Repository } from 'typeorm';
import { SavingsMember } from './savings-member.entity';
import { SavingsContribution } from './savings-contribution.entity';
import { CreateContributionDto, CreateMemberDto } from './savings.dto';
export declare class SavingsService {
    private membersRepo;
    private contribRepo;
    constructor(membersRepo: Repository<SavingsMember>, contribRepo: Repository<SavingsContribution>);
    getMembers(): Promise<SavingsMember[]>;
    createMember(dto: CreateMemberDto): Promise<SavingsMember>;
    addContribution(dto: CreateContributionDto): Promise<SavingsContribution>;
    getMemberReport(memberId: string): Promise<{
        member: SavingsMember;
        totalSaved: number;
        missedCount: number;
        totalEntries: number;
        contributions: SavingsContribution[];
    }>;
    getGroupReport(year?: number, month?: number): Promise<{
        members: any[];
        groupTotal: any;
    }>;
    getMonthlyTotals(): Promise<any[]>;
}
