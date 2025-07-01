import { Paging } from "./pagination";
import { StockmovementView } from "./stockmovement";
import { VehicleView } from "./vehicle";
import { WarehouseView } from "./warehouse";

export declare interface InboundView {
    id: string;
    warehouseId: string;
    stockmovementId: string;
    productId: string;
    vehicleId: string;
    type: string;
    remark: string;
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
    warehouse?: WarehouseView;
    vehicle?: VehicleView;
    stockmovement?: StockmovementView;
}

export declare interface CreateInbound {
    isNewVehiclerdriver: boolean;
    plateNumber: string;
    vehicleName: string;
    nik: string;
    driverName: string;
    phoneNumber: string;
    fromWarehouseId: string;
    toWarehouseId: string;
    remark: string;
    productId: string;
    vehicleId: string;
    sentGrossQuantity: number;
    sentTareQuantity: number;
    sentNetQuantity: number;
    sentTime?: string;
}

export declare interface UpdateInbound {
    recivedGrossQuantity: string | number;
    recivedTareQuantity: string | number;
    recivedNetQuantity: string | number;
}

export declare interface PageInbound extends Paging {
    warehouseId?: string;
    stockmovementId?: string;
    productId?: string;
    vehicleId?: string;
    type?: string;
    remark?: string;
    startSentGrossQuantity?: number;
    startSentTareQuantity?: number;
    startSentNetQuantity?: number;
    startSentTime?: string;
    startRecivedGrossQuantity?: number;
    startRecivedTareQuantity?: number;
    startRecivedNetQuantity?: number;
    startRecivedTime?: string;
    endSentGrossQuantity?: number;
    endSentTareQuantity?: number;
    endSentNetQuantity?: number;
    endSentTime?: string;
    endRecivedGrossQuantity?: number;
    endRecivedTareQuantity?: number;
    endRecivedNetQuantity?: number;
    endRecivedTime?: string;
    createName?: string;
    startCreateDt?: string | DateConstructor;
    endCreateDt?: string | DateConstructor;
    preloads?: string;
}