export declare class CreateProductDto {
    name: string;
    sku: string;
    categoryId?: string;
    quantity: number;
    purchasePrice: number;
    sellingPrice: number;
}
declare const UpdateProductDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateProductDto>>;
export declare class UpdateProductDto extends UpdateProductDto_base {
    isArchived?: boolean;
}
export {};
