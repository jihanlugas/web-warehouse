import { Paging } from "./pagination";
import { ProductView } from "./product";
import { StockView } from "./stock";
import { StockmovementvehicleView } from "./stockmovementvehicle";
import { VehicleView } from "./vehicle";
import { WarehouseView } from "./warehouse";

export declare interface StocklogView {
    id: string;
    warehouseId: string;
    stockId: string;
    stockmovementId: string;
    stockmovementvehicleId: string;
    productId: string;
    vehicleId: string;
    stocklogType: string;
    grossQuantity: number;
    tareQuantity: number;
    netQuantity: number;
    currentQuantity: number;
    createBy: string;
    createDt: string;
    updateBy: string;
    updateDt: string;
    createName: string;
    updateName: string;
    warehouse?: WarehouseView;
    stock?: StockView;
    stockmovementvehicle?: StockmovementvehicleView;
    product?: ProductView;
    vehicle?: VehicleView;
}

export declare interface PageStocklog extends Paging {
    warehouseId?: string;
    stockId?: string;
    stockmovementId?: string;
    stockmovementvehicleId?: string;
    productId?: string;
    vehicleId?: string;
    type?: string;
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