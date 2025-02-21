"use client";

import React, { useState } from "react";
import ButtonCommon from "../commonComponents/ButtonCommon";
import InputCommon from "../commonComponents/InputCommon";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createNotesBookService } from "@/app/services/noteBook";
import { PiFolderPlusBold } from "react-icons/pi";

export default function CreateNotebookModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  // Toggle modal visibility
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setTitle(""); // Clear title when closing
    setError(""); // Clear error when closing
  };

  // Handle input change
  const handleChange = (e) => {
    setTitle(e.target.value);
    setError(""); // Clear error as user types
  };

  // Validate notebook title
  const validateTitle = () => {
    if (!title.trim()) {
      setError("Notebook title is required");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateTitle()) {
      return;
    }

    try {
      setIsLoading(true);

      await createNotesBookService({ title: title.trim() });
      toast.success("Notebook created successfully!");

      setTimeout(() => {
        setIsModalOpen(false);
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to create notebook. Please try again."
      );
    }finally {
        setIsLoading(false);
      }
  };

  return (
    <>
      {/* Button to open modal */}

      <ButtonCommon
        label="Create NoteBook"
        variant="solid"
        onClick={toggleModal}
        className="mt-2"
        isLoading={isLoading}
        disabled={isLoading}
        icon={<PiFolderPlusBold size={20} />}
      />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-md p-6 w-[90%] max-w-md">
            <h2 className="text-xl font-bold text-center mb-4">
              Create Notebook
            </h2>

            {/* Notebook Title Input */}
            <div>
              <InputCommon
                type="text"
                value={title}
                onChange={handleChange}
                placeholder="Enter notebook title"
                label={"Title"}
                name={"title"}
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>

            {/* Buttons */}
            <div className="mt-4 flex justify-end gap-4">
              <ButtonCommon
                variant="outline"
                label="Close"
                onClick={toggleModal}
              />
              <ButtonCommon label="Submit" onClick={handleSubmit} />
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </>
  );
}
