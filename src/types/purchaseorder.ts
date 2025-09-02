import { CustomerView } from "./customer";
import { Paging } from "./pagination";
import { Purchaseorderproduct, PurchaseorderproductView } from "./purchaseorderproduct";
import { StockmovementvehicleView } from "./stockmovementvehicle";
import { TransactionView } from "./transaction";

export declare interface PurchaseorderView {
    id: string;
    customerId: string;
    totalPrice: number;
    totalPayment: number;
    outstanding: number;
    notes: string;
    number: string;
    purchaseorderStatus: string;
    createBy: string;
    createDt: string;
    updateBy: string;
    updateDt: string;
    createName: string;
    updateName: string;
    customer?: CustomerView;
    transactions?: TransactionView[];
    stockmovementvehicles?: StockmovementvehicleView[];
    purchaseorderproducts?: PurchaseorderproductView[];
}

export declare interface CreatePurchaseorder {
    isNewCustomer: boolean;
    customerId: string;
    customerName: string;
    customerPhoneNumber: string;
    totalAmount: string | number;
    notes: string;
    products: Purchaseorderproduct[];
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
    number?: string;
    purchaseorderStatus?: string;
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