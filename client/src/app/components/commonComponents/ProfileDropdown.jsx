"use client"

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { toast } from "react-toastify";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserDetails = localStorage.getItem("notesMasterUserDetails");
      if (storedUserDetails) {
        setUserDetails(JSON.parse(storedUserDetails));
      }
    }
  }, []);

  // handle logout
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token"); // Clear the token from localStorage
      toast.success("Logged out successfully!"); // Display a success message
      router.push("/pages/login"); // Redirect to the login page
    }
  };

  // handle navigation for menu items
  const handleNavigation = (path) => {
    router.push(path); // Navigate to the passed path
  };

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest(".profile-dropdown")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative text-primary-950 profile-dropdown">
      <button
        className="flex items-center space-x-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        {userDetails?.name && (
          <strong className="text-primary-600 text-[20px] ">
            Hi, {userDetails.name.split(" ")[0].charAt(0).toUpperCase() + userDetails.name.split(" ")[0].slice(1)}
          </strong>
        )}
        {userDetails?.profilePicture ? (
          <img
            src={userDetails.profilePicture}
            alt="User Profile"
            className="w-10 h-10 rounded-full border-2 border-primary-600"
          />
        ) : (
          <FaUserCircle className="text-primary-950 text-4xl" />
        )}
      </button>
      {isOpen && (
        <ul className="absolute min-w-[200px] right-0 mt-2 bg-primary-50 shadow-xl border-2 border-primary-600 border-t rounded-md overflow-hidden">
          {/* Menu items */}
          <li
            onClick={() => handleNavigation("/pages/profile")}
            className="p-2 transition-transform duration-300 ease-in-out hover:bg-primary-600 hover:text-primary-100 cursor-pointer"
          >
            Profile
          </li>
          <li
            onClick={() => handleNavigation("/pages/dashboard")}
            className="p-2 transition-transform duration-300 ease-in-out hover:bg-primary-600 hover:text-primary-100 cursor-pointer"
          >
            Dashboard
          </li>
          <li
            onClick={() => handleNavigation("/pages/notes")}
            className="p-2 transition-transform duration-300 ease-in-out hover:bg-primary-600 hover:text-primary-100 cursor-pointer"
          >
            All Notes
          </li>
          {/* Logout */}
          <li
            onClick={handleLogout}
            className="p-2 transition-transform duration-300 ease-in-out hover:bg-primary-600 hover:text-primary-100 cursor-pointer"
          >
            Logout
          </li>
        </ul>
      )}
    </div>
  );
};

export default ProfileDropdown;
