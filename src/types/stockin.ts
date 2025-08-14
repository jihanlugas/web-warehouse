import { Paging } from "./pagination";

export declare interface CreateStockin {
    productId: string;
    notes: string;
    netQuantity: string | number;
}

export declare interface PageStockin extends Paging {
    productId?: string;
    notes?: string;
    stockmovementvehicleStatus?: string;
    startNetQuantity?: string | number;
    endNetQuantity?: string | number;
    createName?: string;
    startCreateDt?: string | DateConstructor;
    endCreateDt?: string | DateConstructor;
    preloads?: string;
}