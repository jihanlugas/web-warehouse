import { CustomerView } from "./customer";
import { Paging } from "./pagination";
import { StockmovementView } from "./stockmovement";
import { TransactionView } from "./transaction";

export declare interface RetailView {
    id: string;
    customerId: string;
    totalPrice: number;
    totalPayment: number;
    outstanding: number;
    notes: string;
    number: string;
    status: string;
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

export declare interface CreateRetail {
    isNewCustomer: boolean;
    customerId: string;
    customerName: string;
    customerPhoneNumber: string;
    totalAmount: string |number;
    notes: string;
    products: RetailProduct[];
}

export declare interface RetailProduct {
    productId: string;
    unitPrice: string | number;
}

export declare interface UpdateRetail {
    notes: string;
}

export declare interface CreateRetailStockmovementvehicle {
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

export declare interface UpdateRetailStockmomentvehicle {
    sentGrossQuantity: number;
    sentTareQuantity: number;
    sentNetQuantity: number;
}

export declare interface PageRetail extends Paging {
    customerId?: string;
    notes?: string;
    number?: string;
    status?: string;
    startTotalPrice?: string | number;
    endTotalPrice?: string | number;
    startTotalPayment?: string | number;
    endTotalPayment?: string | number;
    startOutstanding?: string | number;
    endOutstanding?: string | number;
    createName?: string;
    startCreateDt?: string | DateConstructor;
    endCreateDt?: string | DateConstructor;
    preloads?: string;
}