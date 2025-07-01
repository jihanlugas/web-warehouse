import { Paging } from "./pagination";
import { StockmovementView } from "./stockmovement";
import { VehicleView } from "./vehicle";

export declare interface StockmovementvehicleView {
    id: string;
    stockmovementId: string;
    productId: string;
    vehicleId: string;
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
}

export declare interface CreateStockmovementvehicle {
    stockmovementId: string;
    productId: string;
    vehicleId: string;
    sentGrossQuantity: number;
    sentTareQuantity: number;
    sentNetQuantity: number;
    sentTime?: string;
    recivedGrossQuantity: number;
    recivedTareQuantity: number;
    recivedNetQuantity: number;
    recivedTime?: string;
}

export declare interface UpdateStockmovementvehicle  {
    stockmovementId: string;
    productId: string;
    vehicleId: string;
    sentGrossQuantity: number;
    sentTareQuantity: number;
    sentNetQuantity: number;
    sentTime?: string;
    recivedGrossQuantity: number;
    recivedTareQuantity: number;
    recivedNetQuantity: number;
    recivedTime?: string;
}

export declare interface PageStockmovementvehicle extends Paging {
    stockmovementId?: string;
    productId?: string;
    vehicleId?: string;
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