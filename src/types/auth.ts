import { UserView } from "./user";
import { WarehouseView } from "./warehouse";

export declare interface LoginUser {
    user: UserView
    warehouse?: WarehouseView
}