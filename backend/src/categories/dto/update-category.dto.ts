import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class UpdateCategoryDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;
}
