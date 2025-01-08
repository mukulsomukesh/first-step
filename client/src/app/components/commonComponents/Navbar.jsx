import { FaSearch } from "react-icons/fa";
import ProfileDropdown from "./ProfileDropdown";


const Navbar = () => {
  return (
    <nav className="bg-primary-50 shadow flex justify-between items-center p-4">
      {/* Search */}
      <div className="flex items-center bg-primary-100 text-primary-950 rounded-md border border-primary-950 p-2">
        <FaSearch className=" mr-2" />
        <input
          type="text"
          placeholder="Search"
          className="bg-primary-100  focus:outline-none"
        />
      </div>

      {/* Profile */}
      <ProfileDropdown />
    </nav>
  );
};

export default Navbar;
