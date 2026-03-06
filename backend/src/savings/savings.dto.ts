import {
    IsUUID, IsNumber, IsPositive, IsBoolean, IsOptional, IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateContributionDto {
    @IsUUID()
    memberId: string;

    @IsNumber() @IsPositive() @Type(() => Number)
    amount: number;

    @IsDateString() @IsOptional()
    date?: string;

    @IsBoolean() @IsOptional()
    isMissed?: boolean;
}

export class CreateMemberDto {
    @IsOptional()
    name: string;
}
