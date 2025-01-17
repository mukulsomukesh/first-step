"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation"; // Importing Next.js navigation hooks
import { VscSaveAll } from "react-icons/vsc";
// import { TbUserShare } from "react-icons/tb";
import { MdOutlineDelete } from "react-icons/md";
import { MdDelete } from "react-icons/md";

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
  const [editedTitle, setEditedTitle] = useState(null); // Note data fetched from the backend
  const [noteData, setNoteData] = useState(null); // Note data fetched from the backend
  const [editedContent, setEditedContent] = useState(""); // Note content being edited
  const [editedReminders, setEditedReminders] = useState([]); // Reminder list being edited
  const [remindersEnabled, setRemindersEnabled] = useState(true); // State to enable/disable reminders
  const [isSaving, setIsSaving] = useState(false); // State for save button loading
  const [isDeleting, setIsDeleting] = useState(false); // State for delete button loading
  const [error, setError] = useState(null); // State for managing errors

  // Fetch Note Data
  useEffect(() => {
    const fetchNoteData = async () => {
      if (!noteId) return; // Exit if no noteId is provided

      try {
        const response = await getNoteByIDService(noteId);
        const data = response.data;

        // Update state with fetched data
        setNoteData(data);
        setEditedTitle(data.note.title);
        setEditedContent(data.note.content);
        setEditedReminders(data.reminder || []);
        setRemindersEnabled(data.note.reminderEnabled);
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error("Failed to fetch note data:", error);
        setError("Failed to fetch note data"); // Set error state
        toast.error("Failed to fetch note data");
      }
    };

    fetchNoteData();
  }, [noteId]);

  // Handle checkbox change
  const handleRemindersEnabledChange = (e) => {
    setRemindersEnabled(e.target.checked);
  };

  // Handle Save Changes
  const handleSaveChanges = async () => {
    if (!noteData) return;

    setIsSaving(true); // Set saving state to true

    const payload = {
      reminderEnabled: remindersEnabled && editedReminders.length > 0, // Enable reminder if checkbox is checked and there are reminders
      content: editedContent,
      title: editedTitle,
      upcomingReminders: remindersEnabled ? editedReminders.map((reminder) => ({
        reminderDate: reminder.reminderDate,
      })) : [], // Pass the upcoming reminders array if enabled
    };

    try {
      await updateNoteByIDService(noteId, payload);

      toast.success("Note successfully updated");
    } catch (error) {
      console.error("Error saving note changes:", error);
      toast.error("Failed to update the note");
    } finally {
      setIsSaving(false); // Set saving state to false
    }
  };

  // Handle Reminder Change
  const handleReminderChange = (index, value) => {
    const updatedReminders = [...editedReminders];
    updatedReminders[index].reminderDate = new Date(value).toISOString();
    setEditedReminders(updatedReminders);
  };

  // Add a new reminder
  const handleAddReminder = () => {
    setEditedReminders([...editedReminders, { reminderDate: new Date().toISOString() }]);
  };

  // Handle removing a reminder
  const handleRemoveReminder = (index) => {
    const updatedReminders = editedReminders.filter((_, i) => i !== index);
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
    <div className="flex flex-col gap-1  ">
      <label className="flex items-center">
        <input
          type="checkbox"
          checked={remindersEnabled}
          onChange={handleRemindersEnabledChange}
          className="mr-2"
        />
        Enable Reminders
      </label>
      {remindersEnabled && editedReminders
        .filter((reminder) => !reminder.isDelivered) // Show only undelivered reminders
        .map((reminder, index) => (
          <div key={index} className="flex items-center gap-2 ">
            <InputCommon
              type="datetime-local"
              value={formatReminderDate(reminder.reminderDate)}
              onChange={(e) => handleReminderChange(index, e.target.value)}
            />
            <p className="cursor-pointer bg-red-100 p-2 rounded-md border-2 border-red-600 " onClick={() => handleRemoveReminder(index)}>
              <MdDelete size={30} className="text-red-600" />
            </p>
          </div>
        ))}
      {remindersEnabled && (
        <ButtonCommon
          label="Add Reminder"
          className="mt-2"
          onClick={handleAddReminder}
        />
      )}
    </div>
  );

  // delete note
  const handelDeleteNote = async () => {
    setIsDeleting(true); // Set deleting state to true

    try {
      await deleteNoteByIDService(noteId);
      toast.success("Note successfully deleted");
      setTimeout(() => {
        router.push("/pages/notes");
      }, 2000);
    } catch (error) {
      toast.error("Failed to delete the note");
    } finally {
      setIsDeleting(false); // Set deleting state to false
    }
  };

  return (
    <div className="flex flex-col md:flex-row mt-8 gap-4 px-4 md:px-8">
      {/* Note Editor Section */}
      <div className="w-full md:w-[80%]">
        {error ? (
          <p className="text-red-500">{error}</p> // Display error message
        ) : noteData ? (
          <div className="space-y-3 ">
            {/* Title Input */}
            <InputCommon
              placeholder="Enter Note Title"
              type="text"
              value={editedTitle}
              onChange={(e) => {
                setEditedTitle(e.target.value);
              }}
              aria-label="Note Title" // Accessibility improvement
            />

            {/* Text Editor */}
            <TextEditor
              initialValue={editedContent}
              onContentChange={(newContent) => setEditedContent(newContent)}
            />
          </div>
        ) : (
          <p>Loading...</p> // Loading State
        )}
      </div>

      {/* Sidebar Section */}
      <div className="w-full md:w-[20%] bg-primary-50 h-fit p-2 rounded-md">
        {/* Reminders */}
        <ReminderList />

        {/* Buttons */}
        {/* <ButtonCommon
          label="Share Notes"
          icon={<TbUserShare size="20" />}
          className="w-full mt-2"
          variant="outline"
        /> */}

        <ButtonCommon
          label="Save Changes"
          icon={<VscSaveAll size="20" />}
          className="w-full mt-2"
          onClick={handleSaveChanges}
          isLoading={isSaving} // Pass isLoading state to button
        />

        <ButtonCommon
          label="Delete Notes"
          icon={<MdOutlineDelete size="20" />}
          className="w-full mt-2"
          variant="danger"
          onClick={handelDeleteNote}
          isLoading={isDeleting} // Pass isLoading state to button
        />
      </div>

      <ToastContainer />
    </div>
  );
}
