import { CustomerView } from "./customer";
import { Paging } from "./pagination";
import { PurchaseorderView } from "./purchaseorder";
import { RetailView } from "./retail";

export declare interface TransactionView {
    id: string;
    CustomerId: string;
    RelatedId: string;
    RelatedType: string;
    Type: string;
    Amount: number;
    Notes: string;
    createBy: string;
    createDt: string;
    updateBy: string;
    updateDt: string;
    createName: string;
    updateName: string;
    customer?: CustomerView;
    retail?: RetailView;
    purchaseorder?: PurchaseorderView;
}