"use client"

import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative text-primary-950">
      <button
        className="flex items-center space-x-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaUserCircle className="text-primary-950 text-4xl" />
      </button>
      {isOpen && (
        <ul className="absolute min-w-[200px] right-0 mt-2 bg-primary-100 shadow rounded-md overflow-hidden">
          <li className="p-2 hover:bg-primary-950 hover:text-primary-100 cursor-pointer">Profile</li>
          <li className="p-2 hover:bg-primary-950 hover:text-primary-100 cursor-pointer">Settings</li>
          <li className="p-2 hover:bg-primary-950 hover:text-primary-100 cursor-pointer">Logout</li>
        </ul>
      )}
    </div>
  );
};

export default ProfileDropdown;
