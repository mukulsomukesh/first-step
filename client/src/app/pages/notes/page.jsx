"use client";

import ButtonCommon from "@/app/components/commonComponents/ButtonCommon";
import NotesShortInfoCard from "@/app/components/commonComponents/NotesShortInfoCard";
import React, { useEffect, useState } from "react";
import { FaNotesMedical } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { userNotesListService } from "@/app/services/notes";

export default function Home() {
  const [notes, setNotes] = useState([]); // State to hold notes data
  const router = useRouter();

  const handleRedirectToCreateNotes = () => {
    router.push(`/pages/create`);
  };

  useEffect(() => {
    const fetchNotes = async () => {
      const data = await userNotesListService();
      if (data?.success) {
        setNotes(data.data); // Store the notes in state
      }
    };
    fetchNotes();
  }, []);

  return (
    <div className="px-8 py-4 mt-6">
      <ButtonCommon
        label="Create New Note"
        variant="solid"
        onClick={handleRedirectToCreateNotes}
        icon={<FaNotesMedical />}
      />

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
    </div>
  );
}
