import { Paging } from "./pagination";
import { PurchaseorderView } from "./purchaseorder";
import { RetailView } from "./retail";

export declare interface CustomerView {
    id: string;
    name: string;
    phoneNumber: string;
    email: string;
    address: string;
    createBy: string;
    createDt: string;
    updateBy: string;
    updateDt: string;
    createName: string;
    updateName: string;
    retail?: RetailView[];
    purchaseorders?: PurchaseorderView[];
}

export declare interface CreateCustomer {
    name: string;
    phoneNumber: string;
    email: string;
    address: string;
}

export declare interface UpdateCustomer {
    name: string;
    phoneNumber: string;
    email: string;
    address: string;
}

export declare interface PageCustomer extends Paging {
    name?: string;
    phoneNumber?: string;
    email?: string;
    address?: string;
    createName?: string;
    startCreateDt?: string | DateConstructor;
    endCreateDt?: string | DateConstructor;
    preloads?: string;
}