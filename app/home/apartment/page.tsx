"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function ApartmentPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [lineId, setLineId] = useState("");
  const [taxCode, setTaxCode] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/apartment");
      const data = response.data;
      if (data.name) {
        setName(data.name);
        setEmail(data.email || "");
        setPhone(data.phone);
        setAddress(data.address);
        setLineId(data.lineId || "");
        setTaxCode(data.taxCode);
      }
      console.log("Fetched apartment data:", data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: (error as Error).message,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  return <div></div>;
}
