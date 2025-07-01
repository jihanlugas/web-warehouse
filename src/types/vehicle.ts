import { Paging } from "./pagination";

export declare interface VehicleView {
    id: string;
    warehouseId: string;
    plateNumber: string;
    name: string;
    description: string;
    nik: string;
    driverName: string;
    phoneNumber: string;
    createDt: string;
    updateBy: string;
    updateDt: string;
    createName: string;
    updateName: string;
}

export declare interface CreateVehicle {
    warehouseId: string;
    plateNumber: string;
    name: string;
    description: string;
    nik: string;
    driverName: string;
    phoneNumber: string;
}

export declare interface UpdateVehicle {
    plateNumber: string;
    name: string;
    description: string;
    nik: string;
    driverName: string;
    phoneNumber: string;
}

export declare interface PageVehicle extends Paging {
    warehouseId?: string;
    plateNumber?: string;
    name?: string;
    description?: string;
    nik?: string;
    driverName?: string;
    phoneNumber?: string;
    createName?: string;
    startCreateDt?: string | DateConstructor;
    endCreateDt?: string | DateConstructor;
    preloads?: string;
}