"use client";

import ButtonCommon from "@/app/components/commonComponents/ButtonCommon";
import NotesShortInfoCard from "@/app/components/commonComponents/NotesShortInfoCard";
import React, { useEffect, useState } from "react";
import { FaNotesMedical } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { userNotesListService } from "@/app/services/notes";
import { toast } from "react-toastify"; // Import toast notification library
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import { PiFolderPlusBold } from "react-icons/pi";
import { LuNotebookPen } from "react-icons/lu";
import CreateNotebookModal from "@/app/components/modals/CreateNotebookModal";

export default function Home() {
  const [notes, setNotes] = useState([]); // State to hold notes data
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(""); // State to handle error messages
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRedirectToCreateNotes = () => {
    router.push(`/pages/create`);
  };

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true); // Set loading to true before API call
      setError(""); // Reset error state
      try {
        const data = await userNotesListService();
        if (data?.success) {
          setNotes(data.data); // Store the notes in state
        } else {
          setNotes([]); // Set notes to empty array if no data found
        }
      } catch (error) {
        setError("Failed to fetch notes. Please try again later.");
        toast.error("Failed to fetch notes. Please try again later."); // Display error toast
      }
      setLoading(false); // Set loading to false after API call
    };
    fetchNotes();
  }, []);

  return (
    <div className="px-8 py-4 mt-6">
    
      <ButtonCommon
        label="Write Notes"
        variant="solid"
        onClick={handleRedirectToCreateNotes}
        icon={<LuNotebookPen size={20} />}
        className="mr-4 ml-4"
      />

      <CreateNotebookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {loading ? (
        <div className="flex justify-center mt-8">Please wait...</div>
      ) : error ? (
        <div className="flex justify-center mt-8 text-red-500">{error}</div>
      ) : notes.length === 0 ? (
        <div className="flex justify-center mt-8">No notes found.</div>
      ) : (
        <div className="flex flex-wrap justify-center mt-8 gap-4 w-fit">
          {notes.map((note) => (
            <NotesShortInfoCard
              key={note._id} // Unique key for each note
              id={note._id}
              title={note.title}
              content={note.content} // Assuming NotesShortInfoCard component takes these props
              status={note.status}
              reminderEnabled={note.reminderEnabled}
              createdAt={note.createdAt}
            />
          ))}
        </div>
      )}
    </div>
  );
}
