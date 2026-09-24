export declare class CreateColumnDto {
    title: string;
    color?: string;
}
export declare class UpdateColumnDto {
    title?: string;
    color?: string;
}
export declare class ReorderColumnItemDto {
    id: string;
    order: number;
}
export declare class ReorderColumnsDto {
    items: ReorderColumnItemDto[];
}
