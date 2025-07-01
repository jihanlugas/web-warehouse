import { Paging } from "./pagination";
import { ProductView } from "./product";
import { WarehouseView } from "./warehouse";

export declare interface StockView {
    id: string;
    warehouseId: string;
    productId: string;
    quantity: number;
    createBy: string;
    createDt: string;
    updateBy: string;
    updateDt: string;
    createName: string;
    updateName: string;
    warehouse?: WarehouseView;
    product?: ProductView;
}

export declare interface CreateStock {
    warehouseId: string;
    productId: string;
    quantity: number;
}

export declare interface UpdateStock {
    productId: string;
    quantity: number;
}

export declare interface PageStock extends Paging {
    warehouseId: string;
    productId: string;
    startQuantity?: number;
    endQuantity?: number;
    createName: string;
    preloads: string;
}