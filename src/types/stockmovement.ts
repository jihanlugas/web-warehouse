import { Paging } from "./pagination";
import { ProductView } from "./product";
import { PurchaseorderView } from "./purchaseorder";
import { RetailView } from "./retail";
import { WarehouseView } from "./warehouse";

export declare interface StockmovementView {
    id: string;
    fromWarehouseId: string;
    toWarehouseId: string;
    productId: string;
    relatedId: string;
    type: string;
    unitPrice: number;
    notes: string;
    createDt: string;
    updateBy: string;
    updateDt: string;
    createName: string;
    updateName: string;
    fromWarehouse?: WarehouseView;
    toWarehouse?: WarehouseView;
    product?: ProductView;
    purchaseorder?: PurchaseorderView;
    retail?: RetailView;
}

export declare interface CreateStockmovement {
    fromWarehouseId: string;
    toWarehouseId: string;
    productId: string;
    type: string;
    notes: string;
}

export declare interface UpdateStockmovement {
    fromWarehouseId: string;
    toWarehouseId: string;
    productId: string;
    type: string;
    notes: string;
}

export declare interface PageStockmovement extends Paging {
    fromWarehouseId: string;
    toWarehouseId: string;
    productId: string;
    type: string;
    notes: string;
    createName?: string;
    startCreateDt?: string | DateConstructor;
    endCreateDt?: string | DateConstructor;
    preloads?: string;
}