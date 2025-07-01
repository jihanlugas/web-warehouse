import { Paging } from "./pagination";

export declare interface ProductView {
    id: string;
    name: string;
    description: string;
    createBy: string;
    createDt: string;
    updateBy: string;
    updateDt: string;
    createName: string;
    updateName: string;
}

export declare interface CreateProduct {
    name: string;
    description: string;
}

export declare interface UpdateProduct {
    name: string;
    description: string;
}

export declare interface PageProduct extends Paging {
    name?: string;
    description?: string;
    createName?: string;
    startCreateDt?: string | DateConstructor;
    endCreateDt?: string | DateConstructor;
    preloads?: string;
}