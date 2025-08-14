import { Paging } from "./pagination";

export declare interface UserprivilegeView {
    id: string;
    userId: string;
    stockIn: boolean;
    transferOut: boolean;
    transferIn: boolean;
    purchaseorder: boolean;
    retail: boolean;
    createBy: string;
    createDt: string;
    updateBy: string;
    updateDt: string;
    createName: string;
    updateName: string;
}

export declare interface UpdateUserprivilege {
    stockIn: boolean;
    transferOut: boolean;
    transferIn: boolean;
    purchaseorder: boolean;
    retail: boolean;
}

export declare interface PageUserprivilage extends Paging {
    warehouseId: string;
    userId: string;
    preloads: string;
}