import { Paging } from "./pagination";


export declare interface CreateStockmovementvehiclePurchaseorder {
    isNewVehiclerdriver: boolean;
    plateNumber: string;
    vehicleName: string;
    nik: string;
    driverName: string;
    phoneNumber: string;
    purchaseorderId: string;
    notes: string;
    productId: string;
    vehicleId: string;
    sentGrossQuantity: string | number;
    sentTareQuantity: string | number;
    sentNetQuantity: string | number;
}

export declare interface UpdateStockmovementvehiclePurchaseorder {
    sentGrossQuantity: string | number;
    sentTareQuantity: string | number;
    sentNetQuantity: string | number;
}

export declare interface PageStockmovementvehiclePurchaseorder extends Paging {
    purchaseorderId?: string;
    productId?: string;
    vehicleId?: string;
    notes?: string;
    stockmovementvehicleStatus?: string;
    startSentGrossQuantity?: string | number;
    startSentTareQuantity?: string | number;
    startSentNetQuantity?: string | number;
    startSentTime?: string;
    endSentGrossQuantity?: string | number;
    endSentTareQuantity?: string | number;
    endSentNetQuantity?: string | number;
    endSentTime?: string;
    createName?: string;
    startCreateDt?: string | DateConstructor;
    endCreateDt?: string | DateConstructor;
    preloads?: string;
}