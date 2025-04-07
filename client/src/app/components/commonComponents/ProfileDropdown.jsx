"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import {
  FaUserCircle,
  FaHome,
  FaBook,
  FaStickyNote,
  FaList,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { toast } from "react-toastify";

const menuItems = [
  { label: "Dashboard", icon: <FaHome />, path: "/pages/dashboard" },
  { label: "Notebooks", icon: <FaBook />, path: "/pages/note-book" },
  { label: "Notes", icon: <FaStickyNote />, path: "/pages/notes" },
  { label: "To-Do List", icon: <FaList />, path: "/pages/todo" },
  { label: "Profile", icon: <FaUser />, path: "/pages/profile" },
];

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  // Load user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("notesMasterUserDetails");
    if (stored) {
      setUserDetails(JSON.parse(stored));
    }
  }, []);

  // Logout handler
  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    router.push("/pages/login");
  }, [router]);

  // Navigation handler
  const handleNavigation = useCallback(
    (path) => {
      setIsOpen(false);
      router.push(path);
    },
    [router]
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && !e.target.closest(".profile-dropdown")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Capitalize first name
  const displayName = userDetails?.name?.split(" ")[0] || "";
  const capitalized =
    displayName.charAt(0).toUpperCase() + displayName.slice(1);

  // Active menu checker
  const isActive = (path) => pathname === path;

  return (
    <div className="relative text-black profile-dropdown z-50">
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Profile Toggle */}
      <button
        className="flex items-center gap-2 bg-primary-50 rounded-md px-3 py-2 focus:outline-none"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {userDetails?.name && (
          <span className="text-primary-400 text-2xl font-semibold">
            Hi, {capitalized}
          </span>
        )}
        {userDetails?.profilePicture ? (
          <img
            src={userDetails.profilePicture}
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-primary-600 object-cover"
            title={capitalized}
          />
        ) : (
          <FaUserCircle className="text-primary-950 text-3xl" />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <ul
          className=" overflow-hidden absolute right-0 mt-2 min-w-[220px] bg-primary-50 rounded-md shadow-xl z-20 "
          role="menu"
        >
          {menuItems.map((item) => (
            <li
              key={item.label}
              onClick={() => handleNavigation(item.path)}
              className={`flex items-center gap-2 px-4 py-3 cursor-pointer transition-colors  ${
                isActive(item.path)
                  ? "bg-primary-600 text-white"
                  : "hover:bg-primary-600 hover:text-white "
              }`}
              role="menuitem"
            >
              {item.icon} {item.label}
            </li>
          ))}

          {/* Logout */}
          <li
            onClick={handleLogout}
            className="border-t border-black  flex items-center gap-2 px-4 py-3  text-red-600 hover:bg-red-600 hover:text-white cursor-pointer transition-colors"
            role="menuitem"
          >
            <FaSignOutAlt /> Logout
          </li>
        </ul>
      )}
    </div>
  );
};

export default ProfileDropdown;
