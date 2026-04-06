"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-84 h-screen bg-gray-800 text-white">
      <div className="p-4 text-center bg-gray-900">
        <div className="text-2xl font-bold">Apartment APP</div>
        <div className="text-xl mt-2 ">โปรแกรมบริหารจัดการอพาร์ตเมนต์</div>
      </div>
      <nav className="p-5">
        <ul className="sidebar-menu">
          <li>
            <Link href="/home/apartment" className="flex items-center gap-2">
              <i className="fa-solid fa-house"></i>
              <span>อพาร์ตเมนต์</span>
            </Link>
          </li>
          <li>
            <Link href="/home/room-type" className="flex items-center gap-2">
              <i className="fa-solid fa-bed"></i>
              <span>ประเภทห้อง</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
