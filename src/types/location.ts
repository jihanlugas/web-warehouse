import { Paging } from "./pagination";
import { WarehouseView } from "./warehouse";

export declare interface LocationView {
    id: string;
    name: string;
    notes: string;
    createBy: string;
    createDt: string;
    updateBy: string;
    updateDt: string;
    createName: string;
    updateName: string;
    warehouses?: WarehouseView[];
}

export declare interface PageLocation extends Paging {
    name?: string;
    location?: string;
    isStock?: boolean;
    createName?: string;
    startCreateDt?: string | DateConstructor;
    endCreateDt?: string | DateConstructor;
    preloads?: string;
}