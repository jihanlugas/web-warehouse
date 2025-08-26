import { LocationView } from "./location";
import { Paging } from "./pagination";
import { UserprivilegeView } from "./userprivilage";
import { UserproviderView } from "./userprovider";
import { WarehouseView } from "./warehouse";

export declare interface UserView {
    id: string;
    warehouseId: string;
    userRole: string;
    email: string;
    username: string;
    phoneNumber: string;
    address: string;
    fullname: string;
    passVersion: number;
    isActive: boolean;
    photoId: string;
    photoUrl: string;
    lastLoginDt?: string;
    birthDt?: string;
    birthPlace: string;
    accountVerifiedDt?: string;
    createBy: string;
    createDt: string;
    updateBy: string;
    updateDt: string;
    createName: string;
    updateName: string;
    userprivilege?: UserprivilegeView;
    userproviders?: UserproviderView[];
    warehouse?: WarehouseView;
    location?: LocationView;
}

export declare interface ChangePassword {
    currentPasswd: string;
    passwd: string;
    confirmPasswd: string;
}

export declare interface CreateUser {
    warehouseId: string;
    fullname: string;
    email: string;
    userRole: string;
    phoneNumber: string;
    username: string;
    passwd: string;
    address: string;
    birthDt?: string;
    birthPlace: string;
    stockIn: boolean;
    transferOut: boolean;
    transferIn: boolean;
    purchaseorder: boolean;
    retail: boolean;
}

export declare interface UpdateUser {
    fullname: string;
    email: string;
    phoneNumber: string;
    username: string;
    address: string;
    birthDt?: string;
    birthPlace: string;
}

export declare interface PageUser extends Paging {
    warehouseId?: string;
    fullname?: string;
    email?: string;
    userRole?: string;
    phoneNumber?: string;
    username?: string;
    address?: string;
    birthPlace?: string;
    createName?: string;
    startCreateDt?: string | DateConstructor;
    endCreateDt?: string | DateConstructor;
    preloads?: string;

}