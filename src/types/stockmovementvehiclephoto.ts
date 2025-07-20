import { StockmovementvehicleView } from "./stockmovementvehicle";
import { WarehouseView } from "./warehouse";

export declare interface StockmovementvehiclephotoView {
    id: string;
    warehouseId: string;
    stockmovementvehicleId: string;
    photoId: string;
    photoUrl: string;
    createDt: string;
    updateBy: string;
    updateDt: string;
    createName: string;
    updateName: string;
    warehouse?: WarehouseView;
    stockmovementvehicle?: StockmovementvehicleView;
}

export declare interface CreateStockmovementvehiclephoto {
    warehouseId: string;
    stockmovementvehicleId: string;
    photo?: File;
}