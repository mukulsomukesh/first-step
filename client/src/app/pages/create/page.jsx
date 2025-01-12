"use client";

import ButtonCommon from "@/app/components/commonComponents/ButtonCommon";
import InputCommon from "@/app/components/commonComponents/InputCommon";
import TextEditor from "@/app/components/commonComponents/TextEditor";
import React, { useState, useEffect } from "react";
import { VscSaveAll } from "react-icons/vsc";
import { TbUserShare } from "react-icons/tb";
import { createNotesService } from "@/app/services/notes";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

export default function Page() {
  const [editorContent, setEditorContent] = useState(""); // Store the content of the note
  const [title, setTitle] = useState(""); // Store the title of the note
  const [reminderDates, setReminderDates] = useState([]); // Store the upcoming reminders
  const [remindersEnabled, setRemindersEnabled] = useState(true); // State to enable/disable reminders
  const router = useRouter()

  const calculateDefaultDate = (daysInterval) => {
    const now = new Date();
    now.setHours(19, 0, 0, 0); // Set the time to 7:00 PM
    now.setDate(now.getDate() + daysInterval); // Add days interval to current date
    return now.toISOString().slice(0, 16); // Format to YYYY-MM-DDTHH:MM (for datetime-local)
  };

  useEffect(() => {
    // Set default reminder dates for 1 day, 3 days, 5 days, etc.
    const defaultDates = [1, 3, 5, 7, 10].map((interval) =>
      calculateDefaultDate(interval)
    );
    setReminderDates(defaultDates);
  }, []);

  // Handle changes in the reminder input
  const handleReminderChange = (e, index) => {
    const updatedReminderDates = [...reminderDates];
    updatedReminderDates[index] = e.target.value; // Update specific reminder
    setReminderDates(updatedReminderDates);
  };

  // Handle checkbox change
  const handleRemindersEnabledChange = (e) => {
    setRemindersEnabled(e.target.checked);
  };

  // Handle removing a reminder
  const handleRemoveReminder = (index) => {
    const updatedReminderDates = reminderDates.filter((_, i) => i !== index);
    setReminderDates(updatedReminderDates);
  };

  // Handle adding a new reminder
  const handleAddReminder = () => {
    setReminderDates([...reminderDates, calculateDefaultDate(1)]);
  };

  // Build the payload when the save button is clicked
  const handleSave = async () => {
    const payload = {
      title: title || "Sample Note", // Default title if not provided
      content: editorContent, // The content of the note
      reminderEnabled: remindersEnabled && reminderDates.length > 0, // Enable reminder if checkbox is checked and there are reminders
      upcomingReminders: remindersEnabled ? reminderDates.map((reminder) => ({
        reminderDate: reminder,
      })) : [], // Pass the upcoming reminders array if enabled
    };

    console.log("Payload to be sent:", payload);

    // Example: You can call an API to save the note here
    try {
      const res = await createNotesService(payload);
      router.push(`/pages/notes/edit/${res.data._id}`)
      toast.success("Notes successfully created! ")
    } catch (error) {
      console.log(error);
      toast.error(error?.message?.response?.data?.data || "Notes creation failed ")

    }
  };

  return (
    <div className="flex mt-4 gap-4 px-8">
      <div className="w-[80%] space-y-2">
        {/* Title Input */}
        <InputCommon
          placeholder="Notes Title"
          type="text"
          value={title} // Bind title to the state
          onChange={(e) => setTitle(e.target.value)} // Handle title change
        />
        {/* Text Editor */}
        <TextEditor onContentChange={setEditorContent} />
      </div>

      <div className="w-[20%] bg-primary-50 h-fit p-2 rounded-md">
        <div className="mt-4 flex flex-col gap-1">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={remindersEnabled}
              onChange={handleRemindersEnabledChange}
              className="mr-2"
            />
            Enable Reminders
          </label>
          {remindersEnabled && reminderDates.map((date, index) => (
            <div key={index} className="flex items-center gap-2">
              <InputCommon
                type="datetime-local"
                value={date} // Bind the date to the state
                onChange={(e) => handleReminderChange(e, index)} // Handle reminder change
              />
              <button
                onClick={() => handleRemoveReminder(index)}
                className="text-red-500"
              >
                Remove
              </button>
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

        {/* Buttons */}
        {/* <ButtonCommon
          label="Share Notes"
          icon={<TbUserShare size="20" />}
          className="w-[100%] mt-2"
          variant="outline"
        /> */}

        <ButtonCommon
          label="Save Changes"
          icon={<VscSaveAll size="20" />}
          className="w-[100%] mt-2"
          onClick={handleSave} // Attach save function to button
        />
      </div>

      <ToastContainer />
    </div>
  );
}
