"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation"; // Importing Next.js navigation hooks
import { VscSaveAll } from "react-icons/vsc";
import { TbUserShare } from "react-icons/tb";
import { MdOutlineDelete } from "react-icons/md";

import ButtonCommon from "@/app/components/commonComponents/ButtonCommon";
import InputCommon from "@/app/components/commonComponents/InputCommon";
import TextEditor from "@/app/components/commonComponents/TextEditor";
import {
  deleteNoteByIDService,
  getNoteByIDService,
  updateNoteByIDService,
} from "@/app/services/notes";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function NoteEditorPage() {
  // Router and Params
  const { noteId } = useParams();
  const router = useRouter();

  // State
  const [noteData, setNoteData] = useState(null); // Note data fetched from the backend
  const [editedContent, setEditedContent] = useState(""); // Note content being edited
  const [editedReminders, setEditedReminders] = useState([]); // Reminder list being edited

  // Fetch Note Data
  useEffect(() => {
    const fetchNoteData = async () => {
      if (!noteId) return; // Exit if no noteId is provided

      try {
        const response = await getNoteByIDService(noteId);
        const data = response.data;

        // Update state with fetched data
        setNoteData(data);
        setEditedContent(data.note.content);
        setEditedReminders(data.reminder || []);
      } catch (error) {
        console.error("Failed to fetch note data:", error);
      }
    };

    fetchNoteData();
  }, [noteId]);

  // Handle Save Changes
  const handleSaveChanges = async () => {
    if (!noteData) return;

    const updatedNote = {
      ...noteData.note,
      content: editedContent,
    };

    try {
      await updateNoteByIDService(noteId, updatedNote, editedReminders);
      console.log("Note successfully updated");
    } catch (error) {
      console.error("Error saving note changes:", error);
    }
  };

  // Handle Reminder Change
  const handleReminderChange = (index, value) => {
    const updatedReminders = [...editedReminders];
    updatedReminders[index].reminderDate = new Date(value).toISOString();
    setEditedReminders(updatedReminders);
  };

  // Format Reminder Date for Input
  const formatReminderDate = (dateString) => {
    const date = new Date(dateString);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16); // Convert to local time and format
  };

  // Component for Reminders
  const ReminderList = () => (
    <div className="flex flex-col gap-1">
      <p className="text-[18px] font-semibold">Upcoming Reminders</p>
      {editedReminders
        .filter((reminder) => !reminder.isDelivered) // Show only undelivered reminders
        .map((reminder, index) => (
          <InputCommon
            key={reminder._id}
            type="datetime-local"
            value={formatReminderDate(reminder.reminderDate)}
            onChange={(e) => handleReminderChange(index, e.target.value)}
          />
        ))}
    </div>
  );


  // delete note 
  const handelDeleteNote = async () => {
    try {
      const data = await deleteNoteByIDService(noteId);
      toast.success("Note successfully deleted");
      setTimeout(() => {
        router.push("/pages/notes");
      }, 2000);
    } catch (error) {
      toast.success("Failed to delete the note");
    }
  };

  return (
    <div className="flex mt-4 gap-4 px-8">
      {/* Note Editor Section */}
      <div className="w-[80%]">
        {noteData ? (
          <div className="space-y-3">
            {/* Title Input */}
            <InputCommon
              placeholder="Enter Note Title"
              type="text"
              value={noteData.note.title}
              aria-label="Note Title" // Accessibility improvement
            />

            {/* Text Editor */}
            <TextEditor
              initialValue={editedContent}
              onChange={(newContent) => setEditedContent(newContent)}
            />
          </div>
        ) : (
          <p>Loading...</p> // Loading State
        )}
      </div>

      {/* Sidebar Section */}
      <div className="w-[20%] bg-primary-50 h-fit p-2 rounded-md">
        {/* Reminders */}
        <ReminderList />

        {/* Buttons */}
        <ButtonCommon
          label="Share Notes"
          icon={<TbUserShare size="20" />}
          className="w-full mt-2"
          variant="outline"
        />

        <ButtonCommon
          label="Save Changes"
          icon={<VscSaveAll size="20" />}
          className="w-full mt-2"
          onClick={handleSaveChanges}
        />

        <ButtonCommon
          label="Delete Notes"
          icon={<MdOutlineDelete size="20" />}
          className="w-full mt-2"
          variant="danger"
          onClick={handelDeleteNote}
        />
      </div>

      <ToastContainer />
    </div>
  );
}
