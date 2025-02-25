"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation"; // Importing Next.js navigation hooks
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaRegEdit } from "react-icons/fa";
import { RxDoubleArrowLeft } from "react-icons/rx";
import {
  getNoteByIDService,
  markNoteAsRevisedService,
} from "@/app/services/notes"; // Import the new service
import ButtonCommon from "@/app/components/commonComponents/ButtonCommon";
import "react-quill-new/dist/quill.snow.css";
import "react-quill-new/dist/quill.bubble.css";
import SelectCommon from "@/app/components/commonComponents/SelectCommon";

// Badge component
const Badge = ({ status }) => {
  let colorClass;
  switch (status) {
    case "Revised":
      colorClass = "bg-green-100 text-green-800";
      break;
    case "Not Revised":
      colorClass = "bg-red-100 text-red-800";
      break;
    case "Revision Pending":
      colorClass = "bg-blue-100 text-blue-800";
      break;
    case "Upcoming Revision Schedule":
      colorClass = "bg-yellow-100 text-yellow-800";
      break;
    default:
      colorClass = "bg-gray-100 text-gray-800";
  }

  return (
    <span
      className={`px-2 py-1 rounded-full text-sm font-semibold ${colorClass}`}
    >
      {status}
    </span>
  );
};

export default function ReadNotePageComponent() {
  // Router and Params
  const { noteId } = useParams();
  const router = useRouter();

  // State
  const [noteData, setNoteData] = useState(null); // Note data fetched from the backend
  const [isTodayReminderPending, setIsTodayReminderPending] = useState(false); // State to check if today's reminder is pending
  const [isLoading, setIsLoading] = useState(false); // Loading state for API calls
  const [selectedReadingType, setReadingSelectedType] = useState(""); // State for SelectCommon


    // Select options
    const readingSelectOptions = [
        { value: "hand_written", label: "Hand Written Note" },
        { value: "ai_generated_summery", label: "AI Generated Summery" },
      ];
  


  // Fetch Note Data
  useEffect(() => {
    const fetchNoteData = async () => {
      if (!noteId) return; // Exit if no noteId is provided

      try {
        const response = await getNoteByIDService(noteId, selectedReadingType);
        const data = response.data;

        // Update state with fetched data
        setNoteData(data);

        // Check if today's reminder is pending
        const today = new Date().toLocaleDateString();
        const todayReminder = data.reminder.find(
          (reminder) =>
            new Date(reminder.reminderDate).toLocaleDateString() === today &&
            !reminder.isRevisionDone
        );
        setIsTodayReminderPending(!!todayReminder);
      } catch (error) {
        console.error("Failed to fetch note data:", error);
        toast.error("Failed to load note.");
      }
    };

    fetchNoteData();
  }, [noteId, selectedReadingType]);

  // Format Reminder Date
  const formatReminderDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }); // Convert to readable format without seconds
  };

  // Handle Mark as Revised
  const handleMarkAsRevised = async () => {
    setIsLoading(true);
    try {
      await markNoteAsRevisedService(noteId);
      toast.success("Note marked as revised.");
      setIsTodayReminderPending(false); // Update state to hide the button
    } catch (error) {
      console.error("Failed to mark note as revised:", error);
      toast.error("Failed to mark note as revised.");
    } finally {
      setIsLoading(false);
    }
  };

  // Component for displaying reminders
  const ReminderList = () => (
    <div className="flex flex-col gap-4">
      <p className="text-[18px] font-semibold">Reminders</p>
      {noteData?.reminder?.map((reminder) => {
        const reminderDate = new Date(reminder.reminderDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let status;
        if (reminderDate < today) {
          status = reminder.isRevisionDone ? "Revised" : "Not Revised";
        } else if (reminderDate.toDateString() === today.toDateString()) {
          status = reminder.isRevisionDone ? "Revised" : "Revision Pending";
        } else {
          status = "Upcoming Revision Schedule";
        }

        return (
          <div key={reminder._id} className="text-gray-600">
            <p className="font-semibold">
              {formatReminderDate(reminder.reminderDate)}
            </p>
            <Badge status={status} />
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row mt-8 gap-4 px-4 md:px-8">
      {/* Note Viewer Section */}
      <div className="w-full md:w-[80%] space-y-3 ">
        {noteData ? (
          <div className="space-y-3">
            {/* Title */}
            <h1 className="text-2xl font-bold bg-primary-50 p-2 rounded-md ">
              {noteData.note.title}
            </h1>

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
      <div className="w-full md:w-[20%] bg-primary-50 h-fit p-2 rounded-md">
        {/* Reminders */}
        {noteData && <ReminderList />}

        <SelectCommon label="Select Reading"
        options={readingSelectOptions}
        name="noteType"
        value={selectedReadingType}
        onChange={(e) => setReadingSelectedType(e.target.value)}
        styling={"mt-4"}
        // error={selectedType === "" ? "Please select a type" : ""}
        />


        {/* Mark as Revised Button */}
        {isTodayReminderPending && (
          <ButtonCommon
            label="Mark as Revised"
            onClick={handleMarkAsRevised}
            variant="outline"
            className="w-[100%] mt-4"
            disabled={isLoading} // Disable button while loading
            isLoading={isLoading}
          />
        )}

        {/* Edit Button */}
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
