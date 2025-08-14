import { LocationView } from "./location";
import { Paging } from "./pagination";
import { ProductView } from "./product";
import { PurchaseorderView } from "./purchaseorder";
import { RetailView } from "./retail";
import { StockmovementvehiclephotoView } from "./stockmovementvehiclephoto";
import { VehicleView } from "./vehicle";
import { WarehouseView } from "./warehouse";

export declare interface StockmovementvehicleView {
    id: string;
    fromLocationId: string;
    toLocationId: string;
    fromWarehouseId: string;
    toWarehouseId: string;
    productId: string;
    vehicleId: string;
    relatedId: string;
    stockmovementvehicleType: string;
    notes: string;
    sentGrossQuantity: number;
    sentTareQuantity: number;
    sentNetQuantity: number;
    sentTime?: string;
    receivedGrossQuantity: number;
    receivedTareQuantity: number;
    receivedNetQuantity: number;
    receivedTime?: string;
    shrinkage?: number;
    unitPrice?: number;
    number: string;
    stockmovementvehicleStatus: string;
    createDt: string;
    updateBy: string;
    updateDt: string;
    createName: string;
    updateName: string;

    fromLocation?: LocationView;
    toLocation?: LocationView;
    fromWarehouse?: WarehouseView;
    toWarehouse?: WarehouseView;
    product?: ProductView;
    vehicle?: VehicleView;
    purchaseorder?: PurchaseorderView;
    retail?: RetailView;
    stockmovementvehiclephotos?: StockmovementvehiclephotoView[];
}

export declare interface PageStockmovementvehicle extends Paging {
    fromWarehouseId?: string;
    toWarehouseId?: string;
    type?: string;
    productId?: string;
    vehicleId?: string;
    relatedId?: string;
    status?: string;
    startSentGrossQuantity?: string | number;
    startSentTareQuantity?: string | number;
    startSentNetQuantity?: string | number;
    startSentTime?: string;
    startReceivedGrossQuantity?: string | number;
    startReceivedTareQuantity?: string | number;
    startReceivedNetQuantity?: string | number;
    startReceivedTime?: string;
    endSentGrossQuantity?: string | number;
    endSentTareQuantity?: string | number;
    endSentNetQuantity?: string | number;
    endSentTime?: string;
    endReceivedGrossQuantity?: string | number;
    endReceivedTareQuantity?: string | number;
    endReceivedNetQuantity?: string | number;
    endReceivedTime?: string;
    createName?: string;
    startCreateDt?: string | DateConstructor;
    endCreateDt?: string | DateConstructor;
    preloads?: string;
}