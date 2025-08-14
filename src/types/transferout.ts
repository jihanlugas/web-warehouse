import { Paging } from "./pagination";

export declare interface CreateTransferout {
    isNewVehiclerdriver: boolean;
    plateNumber: string;
    vehicleName: string;
    nik: string;
    driverName: string;
    phoneNumber: string;
    toWarehouseId: string;
    notes: string;
    productId: string;
    vehicleId: string;
    sentGrossQuantity: string | number;
    sentTareQuantity: string | number;
    sentNetQuantity: string | number;
    sentTime?: string;
}

export declare interface UpdateTransferout {
    sentGrossQuantity: string | number;
    sentTareQuantity: string | number;
    sentNetQuantity: string | number;
}

export declare interface PageTransferout extends Paging {
    productId?: string;
    vehicleId?: string;
    notes?: string;
    stockmovementvehicleStatus?: string;
    startSentGrossQuantity?: number;
    startSentTareQuantity?: number;
    startSentNetQuantity?: number;
    startSentTime?: string;
    startReceivedGrossQuantity?: number;
    startReceivedTareQuantity?: number;
    startReceivedNetQuantity?: number;
    startReceivedTime?: string;
    endSentGrossQuantity?: number;
    endSentTareQuantity?: number;
    endSentNetQuantity?: number;
    endSentTime?: string;
    endReceivedGrossQuantity?: number;
    endReceivedTareQuantity?: number;
    endReceivedNetQuantity?: number;
    endReceivedTime?: string;
    createName?: string;
    startCreateDt?: string | DateConstructor;
    endCreateDt?: string | DateConstructor;
    preloads?: string;
}