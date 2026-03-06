import {
    IsString, IsNotEmpty, IsOptional, IsNumber, Min, IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';

export class CreateProductDto {
    @IsString() @IsNotEmpty()
    name: string;

    @IsString() @IsNotEmpty()
    sku: string;

    @IsString() @IsOptional()
    categoryId?: string;

    @IsNumber() @Min(0) @Type(() => Number)
    quantity: number;

    @IsNumber() @Min(0) @Type(() => Number)
    purchasePrice: number;

    @IsNumber() @Min(0) @Type(() => Number)
    sellingPrice: number;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @IsBoolean() @IsOptional()
    isArchived?: boolean;
}
