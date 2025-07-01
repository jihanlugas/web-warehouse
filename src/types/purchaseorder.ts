import { CustomerView } from "./customer";
import { Paging } from "./pagination";
import { StockmovementView } from "./stockmovement";
import { TransactionView } from "./transtaction";

export declare interface PurchaseorderView {
    id: string;
    customerId: string;
    totalAmount: number;
    notes: string;
    number: string;
    createBy: string;
    createDt: string;
    updateBy: string;
    updateDt: string;
    createName: string;
    updateName: string;
    customer?: CustomerView;
    transactions?: TransactionView[];
    stockmovements?: StockmovementView[];
}

export declare interface CreatePurchaseorder {
    isNewCustomer: boolean;
    customerId: string;
    customerName: string;
    customerPhoneNumber: string;
    totalAmount: string | number;
    notes: string;
    products: PurchaseorderProduct[];
}

export declare interface PurchaseorderProduct {
    productId: string;
    unitPrice: string | number;
}

export declare interface UpdatePurchaseorder {
    notes: string;
}

export declare interface CreatePurchaseorderStockmovementvehicle {
    isNewVehiclerdriver: boolean;
    plateNumber: string;
    vehicleName: string;
    nik: string;
    driverName: string;
    phoneNumber: string;
    vehicleId: string;
    stockmovementId: string;
    productId: string;
    sentGrossQuantity: number;
    sentTareQuantity: number;
    sentNetQuantity: number;
}

export declare interface UpdatePurchaseorderStockmomentvehicle {
    sentGrossQuantity: number;
    sentTareQuantity: number;
    sentNetQuantity: number;
}

export declare interface PagePurchaseorder extends Paging {
    customerId?: string;
    notes?: string;
    startTotalAmount?: string | number;
    endTotalAmount?: string | number;
    createName?: string;
    startCreateDt?: string | DateConstructor;
    endCreateDt?: string | DateConstructor;
    preloads?: string;
}