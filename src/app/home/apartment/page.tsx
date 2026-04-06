"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

type ApartmentResponse = {
  name?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  lineId?: string | null;
  taxCode?: string | null;
};

export default function ApartmentPage() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [lineId, setLineId] = useState("");
  const [taxCode, setTaxCode] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get<ApartmentResponse | null>("/api/apartment");
      const data = response.data;
      console.log(data);
      if (data) {
        setName(data.name ?? "");
        setAddress(data.address ?? "");
        setPhone(data.phone ?? "");
        setEmail(data.email ?? "");
        setLineId(data.lineId ?? "");
        setTaxCode(data.taxCode ?? "");
      }
    } catch (error) {
      return Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch data",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        address,
        phone,
        email,
        lineId,
        taxCode,
      };
      await axios.post("/api/apartment", payload);
      return Swal.fire({
        icon: "success",
        title: "Success",
        text: "Data submitted successfully",
      });
    } catch (error) {
      return Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to submit data",
      });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">Apartment Information</h1>
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <div>
            <div>ชื่อหอพัก</div>
            <input
              className="input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <div>ที่อยู่หอพัก</div>
            <input
              className="input"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>
        <div>
          <div>เบอร์โทรศัพท์หอพัก</div>
          <input
            className="input"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <div>อีเมลหอพัก</div>
          <input
            className="input"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <div>เบอร์โทรศัพท์หอพัก</div>
          <input
            className="input"
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <div>Line ID หอพัก</div>
          <input
            className="input"
            type="text"
            value={lineId}
            onChange={(e) => setLineId(e.target.value)}
          />
        </div>
        <div>
          <div>taxCode  </div>
          <input
            className="input"
            type="text"
            value={taxCode}
            onChange={(e) => setTaxCode(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
