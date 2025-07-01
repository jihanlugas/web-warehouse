import { Paging } from "./pagination";
import { ProductView } from "./product";
import { WarehouseView } from "./warehouse";

export declare interface StockinView {
    id: string;
    warehouseId: string;
    productId: string;
    remark: string;
    grossQuantity: number;
    tareQuantity: number;
    netQuantity: number;
    createDt: string;
    updateBy: string;
    updateDt: string;
    createName: string;
    updateName: string;
    warehouse?: WarehouseView;
    product?: ProductView;
}

export declare interface CreateStockin {
    warehouseId: string;
    productId: string;
    remark: string;
    netQuantity: string | number;
}

export declare interface PageStockin extends Paging {
    warehouseId?: string;
    productId?: string;
    remark?: string;
    startGrossQuantity?: string | number;
    startTareQuantity?: string | number;
    startNetQuantity?: string | number;
    endGrossQuantity?: string | number;
    endTareQuantity?: string | number;
    endNetQuantity?: string | number;
    createName?: string;
    startCreateDt?: string | DateConstructor;
    endCreateDt?: string | DateConstructor;
    preloads?: string;
}