import { ProductView } from "./product";
import { PurchaseorderView } from "./purchaseorder";

export declare interface PurchaseorderproductView {
    id: string;
    purchaseorderId: string;
    productId: string;
    unitPrice: number;
    createBy: string;
    createDt: string;
    updateBy: string;
    updateDt: string;
    createName: string;
    updateName: string;
    purchaseorder?: PurchaseorderView;
    product?: ProductView;
}

export declare interface Purchaseorderproduct {
    productId: string;
    unitPrice: string | number;
}