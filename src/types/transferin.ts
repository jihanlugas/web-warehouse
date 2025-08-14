import { Paging } from "./pagination";


export declare interface UpdateTransferin {
    receivedGrossQuantity: string | number;
    receivedTareQuantity: string | number;
    receivedNetQuantity: string | number;
}

export declare interface PageTransferin extends Paging {
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