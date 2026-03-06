import { IsUUID, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSaleDto {
    @IsUUID()
    productId: string;

    @IsNumber() @IsPositive() @Type(() => Number)
    quantity: number;
}
