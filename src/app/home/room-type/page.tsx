"use client";

import { use, useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import Button from "@/components/button";
import RoomTypeInterface from "@/interface/RoomTypeInterface";
import Modal from "@/src/components/ui/modal";

export default function RoomTypePage() {
  const [roomTypes, setRoomTypes] = useState<RoomTypeInterface[]>([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [remark, setRemark] = useState("");
  const [isOpen, setIslOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/room-type");
      const data = response.data;
      setRoomTypes(data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch room types",
      });
    }
  };

  const handleSave = async (form: React.FormEvent<HTMLFormElement>) => {
    form.preventDefault(); // Prevent refresh page
    try {
      const payload = {
        name: name,
        price: price,
        remark: remark,
      };
      if (id) {
        await axios.put(`/api/room-type/${id}`, payload);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Room type updated successfully",
        });
      } else {
        await axios.post("/api/room-type", payload);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Room type created successfully",
        });
      }
      fetchData();
      setIslOpen(false);
      clearForm();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save room type",
      });
    }
  };
  const clearForm = () => {
    setId("");
    setName("");
    setPrice(0);
    setRemark("");
  };

  const handleDelete = async (id: string) => {
    try {
      const buttonConfirm = await Swal.fire({
        icon: "warning",
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (!buttonConfirm.isConfirmed) return;

      if (buttonConfirm.isConfirmed) {
        await axios.delete(`/api/room-type/` + id);

        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Room type deleted successfully",
        });
        fetchData();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete room type",
      });
    }
  };
  return (
    <div>
      <h1 className="text-2xl font-semibold">Room Types</h1>
      <Button
        onClick={() => {
          (setIslOpen(true), clearForm());
        }}
        className="fa fa-plus"
      >
        Add Room Type
      </Button>

      <table className="table mt-2">
        <thead>
          <tr>
            <th>ประเภทห้องพัก</th>
            <th>ราคา</th>
            <th>หมายเหตุ</th>
            <th className="w-24">Action</th>
          </tr>
        </thead>
        <tbody>
          {roomTypes.map((roomType) => (
            <tr key={roomType.id}>
              <td>{roomType.name}</td>
              <td>{roomType.price}</td>
              <td>{roomType.remark}</td>
              <td>
                <div className="flex gap-1">
                  <Button
                    onClick={() => {
                      setId(roomType.id);
                      setName(roomType.name);
                      setPrice(roomType.price);
                      setRemark(roomType.remark || "");
                      setIslOpen(true);
                    }}
                    variant="outline"
                    className="fa fa-edit mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(roomType.id)}
                    variant="outline"
                    className="fa fa-trash"
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={isOpen}
        onClose={() => setIslOpen(false)}
        title={id ? "Edit Room Type" : "Add Room Type"}
        size="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="mb-3">
            <label>ชื่อประเภทห้องพัก</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-modal"
            />
          </div>
          <div className="mb-3">
            <label>ราคาห้องพัก</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="input-modal"
            />
          </div>

          <div className="mb-3">
            <label>หมายเหตุ</label>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="input-modal"
            ></textarea>
          </div>
		  <div className="flex justify-end gap-2">
			<Button onClick={() => setIslOpen(false)} variant="outline">
		  	Cancel
			</Button>
			<Button type="submit" variant="default">
		  	Save
			</Button>
		  </div>	
        </form>
      </Modal>
    </div>
  );
}
