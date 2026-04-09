"use client";

import { useState, useEffect, use } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { RoomInterface } from "@/interface/Roominterface";
import RoomTypeInterface from "@/interface/RoomTypeInterface";
import Button from "@/components/button";
import Modal from "@/src/components/ui/modal";
import { set } from "zod";
import dayjs from "dayjs";

export default function RoomPage() {
  const [rooms, setRooms] = useState<RoomInterface[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomTypeInterface[]>([]);
  const [roomTypeId, setRoomTypeId] = useState("");
  const [filterRoomTypeId, setFilterRoomTypeId] = useState("");
  const [id, setId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [totalRoom, setTotalRoom] = useState(0);
  const [towerName, setTowerName] = useState("");
  const [totalLevel, setTotalLevel] = useState(0);

  // booking
  const [selectRoomId, setSelectRoomId] = useState("");
  const [isOpenBooking, setIsOpenBooking] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [cardId, setCardId] = useState("");
  const [gender, setGender] = useState("");
  const [remark, setRemark] = useState("");
  const [deposit, setDeposit] = useState(0);
  const [stayAt, setStayAt] = useState(new Date());
  const [stayTo, setStayTo] = useState<Date | null>(null);
  const [roomId, setRoomId] = useState("");

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  useEffect(() => {
    if (roomTypes.length > 0) {
      setRoomTypeId(roomTypes[0].id);

      console.log("roomTypes[0].id:", roomTypes[0].id);

      setFilterRoomTypeId(roomTypes[0].id);
    }
  }, [roomTypes]);

  useEffect(() => {
    if (filterRoomTypeId) {
      //  console.log("filterRoomTypeId changed:", filterRoomTypeId);
      fetchdata();
    }
  }, [filterRoomTypeId]);

  useEffect(() => {
    if (selectRoomId) {
      console.log("selectRoomId changed:", selectRoomId);
      const lastBooking = rooms.find((room) => room.id === selectRoomId)
        ?.bookings?.[0];
      if (lastBooking) {
        setCustomerName(lastBooking.customerName);
        setCustomerPhone(lastBooking.customerPhone);
        setCustomerAddress(lastBooking.customerAddress);
        setCardId(lastBooking.cardId);
        setGender(lastBooking.gender);
        setRemark(lastBooking.remark || "");
        setDeposit(lastBooking.deposit);
        setStayAt(new Date(lastBooking.stayAt));
        if (lastBooking.stayTo) {
          setStayTo(lastBooking.stayTo);
        } 
        setRemark(lastBooking.remark || "");
        setRoomId(lastBooking.roomId);
       
      }
    }
  }, [selectRoomId]);

  const fetchdata = async () => {
    try {
      console.log("Fetching rooms with filterRoomTypeId:", filterRoomTypeId);

      const response = await axios.get("/api/room/list/" + filterRoomTypeId);
      setRooms(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch rooms",
      });
    }
  };

  const fetchRoomTypes = async () => {
    try {
      const response = await axios.get("/api/room-type");
      setRoomTypes(response.data);
      console.log("roomTypes:", response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: (error as Error).message || "Failed to fetch room types",
      });
    }
  };
  const handleSave = async (form: React.FormEvent<HTMLFormElement>) => {
    form.preventDefault(); // Prevent refresh page
    try {
      const payload = {
        towerName: towerName,
        totalLevel: totalLevel,
        totalRoom: totalRoom,
        roomTypeId: roomTypeId,
      };
      console.log("payload:", payload);
      if (id) {
        await axios.put("/api/room/" + id, payload);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Room updated successfully",
        });
      } else {
        await axios.post("/api/room", payload);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Room created successfully",
        });
      }
      return fetchdata();
      setIsOpen(false);
      clearForm();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: (error as Error).message || "Failed to save room",
      });
    }
  };
  const clearForm = () => {
    setId("");
    setTowerName("");
    setTotalLevel(0);
    setTotalRoom(0);
    setRoomTypeId(roomTypes[0]?.id);
  };

  const handleBooking = async (form: React.FormEvent<HTMLFormElement>) => {
    form.preventDefault(); // Prevent refresh page
    try {
      const payload = {
        customerName: customerName,
        customerPhone: customerPhone,
        customerAddress: customerAddress,
        cardId: cardId,
        gender: gender,
        roomId: selectRoomId,
        remark: remark,
        deposit: deposit,
        stayAt: stayAt,
        stayTo: stayTo,
      };

      await axios.post("/api/booking", payload);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Booking created successfully",
      });
      setIsOpenBooking(false);
      clearBookingForm();
      fetchdata();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: (error as Error).message || "Failed to save booking",
      });
    }
  };

  const clearBookingForm = () => {
    setCustomerName("");
    setCustomerPhone("");
    setCustomerAddress("");
    setCardId("");
    setGender("");
    setRemark("");
    setDeposit(0);
    setStayAt(new Date());
    setStayTo(new Date());
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">จัดการห้องพัก</h1>
      <Button
        onClick={() => {
          setIsOpen(true);
          clearForm();
        }}
        variant="default"
      >
        เพิ่มรายการ
      </Button>
      <div className="flex gap-1 mt-3 shadow-2xl">
        <span className="w-40 justify-center bg-gray-400 p-3 rounded-1-md">
          ประเภทห้องพัก
        </span>
        <select
          value={filterRoomTypeId}
          onChange={(e) => setFilterRoomTypeId(e.target.value)}
          className="input-modal"
        >
          {roomTypes.map((roomType) => (
            <option key={roomType.id} value={roomType.id}>
              {roomType.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-5 gap-1 mt-3">
        {rooms.map((room) => (
          <div
            key={room.id}
            className={`p-2 rounded-md shadow-lg border border-gray-400
              ${room.status == "active" ? "bg-green-200" : "bg-red-200"}
              ${room.statusEmpty == "no" ? "hover:bg-red-100" : "hover:bg-green-300"}`}
          >
            <div className="text-xl font-semibold">{room.name}</div>
            <div>{room.roomType.name}</div>
            <div>
              ค่าเช่า :
              <span className="font-bold text-lg">
                {room.roomType.price.toLocaleString()} บาท
              </span>
            </div>
            {room.statusEmpty == "no" ? (
              <div className="text-red-500 font-bold">
                <i className="fa-solid fa-xmark mr-2"></i>
                ห้องเต็ม
              </div>
            ) : (
              <div className="text-green-600 font-bold">
                <i className="fa-solid fa-check mr-2"></i>
                ห้องว่าง
              </div>
            )}

            <div>
              {room.status == "active" ? (
                <>
                  <Button
                    className="bg-blue-600 hover:bg-blue-800"
                    onClick={() => {
                      setSelectRoomId(room.id);
                      setIsOpenBooking(true);
                    }}
                  >
                    <i className="fa-solid fa-bed mr-2"></i>
                    ผู้เข้าพัก
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      const buttonConfirm = await Swal.fire({
                        title: "Are you sure?",
                        text: "You won't be able to revert this!",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Yes, delete it!",
                      });
                      if (!buttonConfirm.isConfirmed) return;

                      if (buttonConfirm.isConfirmed) {
                        await axios.delete(`/api/room/` + room.id);
                        Swal.fire({
                          icon: "success",
                          title: "Success",
                          text: "Room deleted successfully",
                        });
                        fetchdata();
                      }
                    }}
                  >
                    ลบ
                  </Button>
                </>
              ) : (
                <Button
                  variant="default"
                  onClick={async () => {
                    const buttonConfirm = await Swal.fire({
                      title: "Are you sure?",
                      text: "You want to reactivate this room!",
                      showCancelButton: true,
                      showConfirmButton: true,
                      confirmButtonColor: "#3085d6",
                      cancelButtonColor: "#d33",
                      confirmButtonText: "Yes, reactivate it!",
                    });
                    if (buttonConfirm.isConfirmed) {
                      await axios.put(`/api/room/` + room.id);
                      Swal.fire({
                        icon: "success",
                        title: "Success",
                        text: "Room reactivated successfully",
                      });
                      fetchdata();
                    }
                  }}
                >
                  เปิดใช้งาน
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={id ? "แก้ไขข้อมูลห้องพัก" : "เพิ่มข้อมูลห้องพัก"}
        size="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label>ประเภทห้องพัก</label>
            <select
              className="input-modal"
              value={roomTypeId}
              onChange={(e) => setRoomTypeId(e.target.value)}
            >
              {roomTypes.map((roomType) => (
                <option key={roomType.id} value={roomType.id}>
                  {roomType.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-4 mt-3">
            <div>
              <label>ตึก</label>
              <input
                type="text"
                className="input-modal"
                value={towerName}
                onChange={(e) => setTowerName(e.target.value)}
                required
              />
            </div>
            <div>
              <label>จำนวนชั้น</label>
              <input
                type="number"
                className="input-modal"
                value={totalLevel}
                onChange={(e) => setTotalLevel(Number(e.target.value))}
                required
              />
            </div>
            <div>
              <label>จำนวนห้องต่อชั้น</label>
              <input
                type="number"
                className="input-modal"
                value={totalRoom}
                onChange={(e) => setTotalRoom(Number(e.target.value))}
                required
              />
            </div>
          </div>
          <Button type="submit" variant="default" className="mt-3">
            <i className="fa-solid fa-floppy-disk mr-2"></i>
            บันทึก
          </Button>
        </form>
      </Modal>

      <Modal
        title="ผู้เข้าพัก"
        isOpen={isOpenBooking}
        onClose={() => setIsOpenBooking(false)}
        size="md"
      >
        <form onSubmit={handleBooking} className="flex flex-col space-y-4">
          <div className="flex flex-col gap-2">
            <div>
              <div>ห้องที่จอง</div>
              <input
                type="text"
                className="bg-blue-200 px-4 py-2 rounded-md w-full border border-gray-600"
                value={
                  rooms.find((room) => room.id === selectRoomId)?.name || ""
                }
                //value ={selectRoomId}
                disabled
              />
            </div>
            <div>
              <label>ชื่อผู้เข้าพัก</label>
              <input
                type="text"
                className="input-modal"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
              />
            </div>
            <div>
              <label>เบอร์โทรศัพท์</label>
              <input
                type="text"
                className="input-modal"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label>ที่อยู่</label>
            <input
              type="text"
              className="input-modal"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-2">
            <div className="w-full">
              <label>เลขบัตรประชาชน</label>
              <input
                type="text"
                className="input-modal"
                value={cardId}
                onChange={(e) => setCardId(e.target.value)}
                required
              />
            </div>
            <div className="w-full">
              <label>เพศ</label>
              <select
                className="input-modal"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">เลือกเพศ</option>
                <option value="male">ชาย</option>
                <option value="female">หญิง</option>
              </select>
            </div>
          </div>
          <div>
            <div>เงินมัดจำ</div>
            <input
              type="number"
              className="input-modal"
              value={deposit}
              onChange={(e) => setDeposit(Number(e.target.value))}
              required
            />
          </div>
          <div className="flex gap-2">
            <div className="w-full">
              <div>วันที่เข้าพัก</div>
              <input
                type="date"
                className="input-modal"
                value={dayjs(stayAt).format("YYYY-MM-DD")}
                onChange={(e) => setStayAt(new Date(e.target.value))}
                required
              />
            </div>
            <div className="w-full">
              <div>วันที่ออก</div>
              <div className="flex gap-1">
                <input
                  type="date"
                  className="input-modal"
                  value={stayTo ? dayjs(stayTo).format("YYYY-MM-DD") : ""}
                  onChange={(e) => setStayTo(new Date(e.target.value))}
                  required
                />
                <Button
                  type="button"
                  className="w-30 mt-2"
                  variant="destructive"
                  onClick={() => setStayTo(null)}
                >
                  ไม่กำหนด
                </Button>
              </div>
            </div>
          </div>
          <div>
            <div>หมายเหตุ</div>
            <input
              type="text"
              className="input-modal"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          </div>
          <div>
            <Button type="submit" variant="default" className="mt-3">
              <i className="fa-solid fa-floppy-disk mr-2"></i>
              บันทึก
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
