import { Paging } from "./pagination";
import { StockView } from "./stock";
import { StocklogView } from "./stocklog";
import { UserView } from "./user";

export declare interface WarehouseView {
    id: string;
    name: string;
    location: string;
    isStockin: boolean;
    isInbound: boolean;
    isOutbound: boolean;
    isRetail: boolean;
    isPurchaseorder: boolean;
    photoId: string;
    photoUrl: string;
    totalRunningOutbound: number;
    totalRunningInbound: number;
    createBy: string;
    createDt: string;
    updateBy: string;
    updateDt: string;
    createName: string;
    updateName: string;
    users?: UserView[];
    stocks?: StockView[];
    stocklogs?: StocklogView[];
}

export declare interface CreateWarehouse {
    name: string;
    location: string;
}

export declare interface UpdateWarehouse {
    name: string;
    location: string;
}

export declare interface PageWarehouse extends Paging {
    name?: string;
    location?: string;
    isStock?: boolean;
    createName?: string;
    startCreateDt?: string | DateConstructor;
    endCreateDt?: string | DateConstructor;
    preloads?: string;
}