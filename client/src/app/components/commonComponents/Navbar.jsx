"use client"

import { FaSearch } from "react-icons/fa";
import ProfileDropdown from "./ProfileDropdown";
import Image from "next/image";
import { IoNotifications } from "react-icons/io5";
import Link from "next/link";
import ButtonCommon from "./ButtonCommon";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Function to check login status
  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Sets true if token exists, false otherwise
  };

  useEffect(() => {
    // Check login status initially
    checkLoginStatus();

    // Recheck login status whenever the route changes
    checkLoginStatus();
  }, [pathname]); // Dependency array with pathname to track route changes

  // Function to handle login button click
  const handleLoginClick = () => {
    router.push("/pages/login"); // Redirect to login page
  };

  // Function to handle signup button click
  const handleSignupClick = () => {
    router.push("/pages/signup"); // Redirect to signup page
  };

  return (
    <nav
      className="bg-primary-50 w-[100%] fixed shadow flex justify-between items-center p-1 px-6"
      style={{ zIndex: "9999" }}
    >
      {/* Logo */}
      <Link href="/pages/notes">
        <div className="flex justify-center items-center">
          <Image
            src="/assets/images/logo.svg"
            alt="Workwise"
            width={45}
            height={45}
            priority={true}
          />
          <p className="text-[20px] font-bold">NoteMaster</p>
        </div>
      </Link>

      {/* Right Section */}
      <div className="flex justify-center items-center gap-4">
        {isLoggedIn ? (
          <>
            {/* <FaSearch size="20" />
            <IoNotifications size="22" /> */}
            <ProfileDropdown />
          </>
        ) : (
          <>
            <ButtonCommon label="Login" variant="outline" onClick={handleLoginClick} />
            <ButtonCommon label="Sign Up" onClick={handleSignupClick} />
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
