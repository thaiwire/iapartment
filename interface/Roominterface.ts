
import RoomTypeInterface from "./RoomTypeInterface";
import { BookingInterface } from "./BookingInterface";

export interface RoomInterface {
    id: string;
    name: string;
    towerName : string;
    totalLevel: number;
    totalRoom: number;
    roomTypeId : string;
    roomType: RoomTypeInterface;
    remark?: string;
    status: string;
    statusEmpty: string;
    createdAt: Date;
    updatedAt: Date;
    bookings: BookingInterface[];
}