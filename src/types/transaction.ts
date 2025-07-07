import { CustomerView } from "./customer";
import { Paging } from "./pagination";
import { PurchaseorderView } from "./purchaseorder";
import { RetailView } from "./retail";

export declare interface TransactionView {
    id: string;
    customerId: string;
    eelatedId: string;
    relatedType: string;
    type: string;
    amount: number;
    botes: string;
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

export declare interface CreateTransaction {
    relatedId: string;
    relatedType: string;
    type: string;
    amount: string | number;
    notes: string;
}

export declare interface UpdateTransaction {
    notes: string;
}

export declare interface PageTransaction extends Paging {
    customerId?: string;
    relatedId?: string;
    relatedType?: string;
    createName?: string;
    startAmount?: string | number;
    endAmount?: string | number;
    startCreateDt?: string | DateConstructor;
    endCreateDt?: string | DateConstructor;
    preloads?: string;
}