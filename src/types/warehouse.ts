import { LocationView } from "./location";
import { Paging } from "./pagination";
import { StockView } from "./stock";
import { StocklogView } from "./stocklog";
import { UserView } from "./user";

export declare interface WarehouseView {
    id: string;
    name: string;
    isStockin: boolean;
    isTransferIn: boolean;
    isTransferOut: boolean;
    isRetail: boolean;
    isPurchaseorder: boolean;
    photoId: string;
    photoUrl: string;
    totalRunningTransferout: number;
    totalRunningTransferin: number;
    createBy: string;
    createDt: string;
    updateBy: string;
    updateDt: string;
    createName: string;
    updateName: string;
    users?: UserView[];
    stocks?: StockView[];
    stocklogs?: StocklogView[];
    location?: LocationView;
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