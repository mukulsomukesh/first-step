import { FaRegFileAlt } from "react-icons/fa"; // Example icons

const Sidebar = () => {
  return (
    <aside className="bg-primary-950 w-64 h-screen text-primary-100 flex flex-col justify-between p-4">
      <div>
        {/* Logo */}
        <div className="bg-primary-100 text-primary-950 p-3 rounded-md mb-6 text-center w-fit ">
          <h1 className="font-bold">App Logo</h1>
        </div>

        {/* Menu */}
        <ul className="space-y-4">
          <li className=" flex items-center space-x-2 cursor-pointer hover:bg-primary-200 hover:text-primary-950 p-2 rounded">
            <FaRegFileAlt />
            <span>Create Logo</span>
          </li>
          <li className=" cursor-pointer hover:bg-primary-200 hover:text-primary-950 p-2 rounded">First</li>
          <li className=" cursor-pointer hover:bg-primary-200 hover:text-primary-950 p-2 rounded">Second</li>
          <li className=" cursor-pointer hover:bg-primary-200 hover:text-primary-950 p-2 rounded">Third</li>
        </ul>
      </div>

      {/* Logout */}
      <div className="bg-primary-200 text-center p-3 rounded-md">
        <button className="text-gray-800 font-bold">LOGOUT</button>
      </div>
    </aside>
  );
};

export default Sidebar;
