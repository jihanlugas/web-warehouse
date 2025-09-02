import { LocationView } from "./location";
import { Paging } from "./pagination";
import { StockmovementvehicleView } from "./stockmovementvehicle";
import { WarehouseView } from "./warehouse";



export declare interface AuditlogView {
    id: string;
    locationId: string;
    warehouseId: string;
    stockmovementvehicleId: string;
    auditlogType: string;
    title: string;
    description: string;
    request: string;
    response: string;
    createBy: string;
    createDt: string;
    updateBy: string;
    updateDt: string;
    createName: string;
    updateName: string;
    location?: LocationView;
    warehouse?: WarehouseView;
    stockmovementvehicle?: StockmovementvehicleView;
}

export declare interface PageAuditlog extends Paging {
    locationId?: string;
    warehouseId?: string;
    stockmovementvehicleId?: string;
    auditlogType?: string;
    title?: string;
    description?: string;
    createName?: string;
    startCreateDt?: string | DateConstructor;
    endCreateDt?: string | DateConstructor;
    preloads?: string;
}