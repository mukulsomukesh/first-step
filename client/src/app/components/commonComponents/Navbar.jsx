import { FaSearch } from "react-icons/fa";
import ProfileDropdown from "./ProfileDropdown";
import Image from "next/image";
import { IoNotifications } from "react-icons/io5";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav
      className="bg-primary-50 w-[100%] fixed shadow flex justify-between items-center p-3 px-6"
      style={{ zIndex: "9999" }}
    >
      {/* Search */}

      <Link href="/pages/notes">
        <div className="flex justify-center items-center ">
          <Image
            src="/assets/images/logo.svg"
            alt="Workwise"
            width={45}
            height={45}
            priority={true}
          />
          <p className="text-[20px] font-bold ">NoteMaster</p>
        </div>
      </Link>

      {/* <div className="flex items-center bg-primary-100 text-primary-950 rounded-md border border-primary-950 p-2">
      
        <FaSearch className=" mr-2" />
        <input
          type="text"
          placeholder="Search"
          className="bg-primary-100  focus:outline-none"
        />
      </div> */}

      {/* Profile */}

      <div className="flex justify-center items-center gap-4 ">
        <FaSearch size="20" />
        <IoNotifications size="22" />

        <ProfileDropdown />
      </div>
    </nav>
  );
};

export default Navbar;
