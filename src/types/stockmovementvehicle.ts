import { Paging } from "./pagination";
import { ProductView } from "./product";
import { PurchaseorderView } from "./purchaseorder";
import { RetailView } from "./retail";
import { StockmovementView } from "./stockmovement";
import { StockmovementvehiclephotoView } from "./stockmovementvehiclephoto";
import { VehicleView } from "./vehicle";

export declare interface StockmovementvehicleView {
    id: string;
    stockmovementId: string;
    productId: string;
    vehicleId: string;
    type: string;
    sentGrossQuantity: number;
    sentTareQuantity: number;
    sentNetQuantity: number;
    sentTime?: string;
    recivedGrossQuantity: number;
    recivedTareQuantity: number;
    recivedNetQuantity: number;
    recivedTime?: string;
    shrinkage?: number;
    status: string;
    number: string;
    createDt: string;
    updateBy: string;
    updateDt: string;
    createName: string;
    updateName: string;
    vehicle?: VehicleView;
    stockmovement?: StockmovementView;
    stockmovementvehicle?: StockmovementvehicleView;
    purchaseorder?: PurchaseorderView;
    retail?: RetailView;
    product?: ProductView;
    stockmovementvehiclephotos?: StockmovementvehiclephotoView[];
}

export declare interface CreateStockmovementvehiclePurchaseorder {
    fromWarehouseId: string;
    purchaseorderId: string;
    productId: string;
    isNewVehiclerdriver: boolean;
    plateNumber: string;
    vehicleId: string;
    vehicleName: string;
    nik: string;
    driverName: string;
    phoneNumber: string;
    sentGrossQuantity: string | number;
    sentTareQuantity: string | number;
    sentNetQuantity: string | number;
}

export declare interface UpdateStockmovementvehiclePurchaseorder {
    sentGrossQuantity: string | number;
    sentTareQuantity: string | number;
    sentNetQuantity: string | number;
}

export declare interface CreateStockmovementvehicleRetail {
    fromWarehouseId: string;
    retailId: string;
    productId: string;
    isNewVehiclerdriver: boolean;
    plateNumber: string;
    vehicleId: string;
    vehicleName: string;
    nik: string;
    driverName: string;
    phoneNumber: string;
    sentGrossQuantity: string | number;
    sentTareQuantity: string | number;
    sentNetQuantity: string | number;
}

export declare interface UpdateStockmovementvehicleRetail {
    sentGrossQuantity: string | number;
    sentTareQuantity: string | number;
    sentNetQuantity: string | number;
}

export declare interface PageStockmovementvehicle extends Paging {
    fromWarehouseId?: string;
    toWarehouseId?: string;
    type?: string;
    productId?: string;
    vehicleId?: string;
    relatedId?: string;
    startSentGrossQuantity?: string | number;
    startSentTareQuantity?: string | number;
    startSentNetQuantity?: string | number;
    startSentTime?: string;
    startRecivedGrossQuantity?: string | number;
    startRecivedTareQuantity?: string | number;
    startRecivedNetQuantity?: string | number;
    startRecivedTime?: string;
    endSentGrossQuantity?: string | number;
    endSentTareQuantity?: string | number;
    endSentNetQuantity?: string | number;
    endSentTime?: string;
    endRecivedGrossQuantity?: string | number;
    endRecivedTareQuantity?: string | number;
    endRecivedNetQuantity?: string | number;
    endRecivedTime?: string;
    createName?: string;
    startCreateDt?: string | DateConstructor;
    endCreateDt?: string | DateConstructor;
    preloads?: string;
}