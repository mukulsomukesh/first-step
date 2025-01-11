"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation"; // Importing Next.js navigation hooks
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaRegEdit } from "react-icons/fa";
import { RxDoubleArrowLeft } from "react-icons/rx";
import { getNoteByIDService } from "@/app/services/notes";
import ButtonCommon from "@/app/components/commonComponents/ButtonCommon";
import 'react-quill-new/dist/quill.snow.css';
import 'react-quill-new/dist/quill.bubble.css';


export default function NoteViewerPage() {
  // Router and Params
  const { noteId } = useParams();
  const router = useRouter();

  // State
  const [noteData, setNoteData] = useState(null); // Note data fetched from the backend

  // Fetch Note Data
  useEffect(() => {
    const fetchNoteData = async () => {
      if (!noteId) return; // Exit if no noteId is provided

      try {
        const response = await getNoteByIDService(noteId);
        const data = response.data;

        // Update state with fetched data
        setNoteData(data);
      } catch (error) {
        console.error("Failed to fetch note data:", error);
        toast.error("Failed to load note.");
      }
    };

    fetchNoteData();
  }, [noteId]);

  // Format Reminder Date
  const formatReminderDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // Convert to readable format
  };

  // Component for displaying reminders
  const ReminderList = () => (
    <div className="flex flex-col gap-1">
      <p className="text-[18px] font-semibold">Upcoming Reminders</p>
      {noteData?.reminder
        ?.filter((reminder) => !reminder.isDelivered) // Show only undelivered reminders
        .map((reminder) => (
          <p key={reminder._id} className="text-gray-600">
            {formatReminderDate(reminder.reminderDate)}
          </p>
        ))}
    </div>
  );

  return (
    <div className="flex mt-4 gap-4 px-8">
      {/* Note Viewer Section */}
      <div className="w-[80%]">
        {noteData ? (
          <div className="space-y-3">
            {/* Title */}
            <h1 className="text-2xl font-bold bg-primary-50 p-2 rounded-md ">{noteData.note.title}</h1>

            {/* Render Content as HTML */}
            <div
              className="prose ql-editor max-w-full p-4 border-2 rounded-md max-h-[90vh]  overflow-y-auto    "
              dangerouslySetInnerHTML={{ __html: noteData.note.content }}
            />
          </div>
        ) : (
          <p>Loading...</p> // Loading State
        )}
      </div>

      {/* Sidebar Section */}
      <div className="w-[20%] bg-primary-50 h-fit p-2 rounded-md ">
        {/* Reminders */}
        {noteData && <ReminderList />}

        {/* Back Button */}
        <ButtonCommon
          label="Edit Note"
          onClick={() => router.push(`/pages/notes/edit/${noteId}`)}
          variant="outline"
          className="w-[100%] mt-4"
          icon={<FaRegEdit />}
        />

        {/* Back Button */}
        <ButtonCommon
          label="Back to Notes"
          onClick={() => router.push("/pages/notes")}
          variant="outline"
          className="w-[100%] mt-4"
          icon={<RxDoubleArrowLeft />}
        />
      </div>

      <ToastContainer />
    </div>
  );
}
