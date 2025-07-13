import { ProductView } from "./product";
import { RetailView } from "./retail";

export declare interface RetailproductView {
    id: string;
    retailId: string;
    productId: string;
    unitPrice: number;
    createBy: string;
    createDt: string;
    updateBy: string;
    updateDt: string;
    createName: string;
    updateName: string;
    retail?: RetailView;
    product?: ProductView;
}

export declare interface Retailproduct {
    productId: string;
    unitPrice: string | number;
}