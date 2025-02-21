"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getNotesBookService } from "@/app/services/noteBook";
import { PiFolderPlusBold } from "react-icons/pi";
import { FaFolder } from "react-icons/fa6";
import CreateNotebookModal from "@/app/components/modals/CreateNotebookModal";

export default function Page() {
  const [notebooks, setNotebooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchNotebooks();
  }, []);

  // Fetch notebooks from the API
  const fetchNotebooks = async () => {
    try {
      const response = await getNotesBookService();
      setNotebooks(response.data);
    } catch (error) {
      console.error("Error fetching notebooks:", error);
      toast.error("Failed to fetch notebooks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-gray-800 text-3xl font-bold">All Notebooks</h1>
     

        <div >
          <CreateNotebookModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
      </div>

      {loading ? (
        <p className="text-gray-600 text-center">Loading notebooks...</p>
      ) : notebooks?.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-4 ">
          {notebooks.map((notebook) => (
            <div
              key={notebook._id}
              onClick={() => router.push(`note-book/read/${notebook._id}`)}
              className="cursor-pointer bg-white shadow-lg rounded-lg md:w-[320px] w-[90%] p-2 border border-gray-200 hover:shadow-xl transition-all "
            >
            <div className="inline-flex justify-start items-center gap-4 w-[100%] " >
             <p className="" >
              <FaFolder size={50} className="text-yellow-500" />
             </p>
              <h2 className="text-gray-800 text-xl font-semibold line-clamp-2 overflow-hidden text-ellipsis">
              {notebook.title} 
              </h2>
            </div>
      
              {/* <p className="text-gray-500 text-sm">
                Created At: {new Date(notebook.createdAt).toLocaleDateString()}
              </p> */}
              <p
                className={`text-sm font-semibold mt-2 ${
                  notebook.status === "active"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
              {notebook.activeNotesCount} Notes
                {/* {notebook.status} */}
              </p>
              {notebook.status !== "active" && (
                <span className="absolute top-4 right-4 text-gray-400">
                  <FaFolder size={20} />
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No notebooks found.</p>
      )}

      <ToastContainer />
    </div>
  );
}
