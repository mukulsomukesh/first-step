"use client";

import ButtonCommon from "@/app/components/commonComponents/ButtonCommon";
import InputCommon from "@/app/components/commonComponents/InputCommon";
import TextEditor from "@/app/components/commonComponents/TextEditor";
import React, { useState, useEffect } from "react";
import { VscSaveAll } from "react-icons/vsc";
import { MdDelete } from "react-icons/md";
import { createNotesService } from "@/app/services/notes";
import { getNotesBookService } from "@/app/services/noteBook";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
const Select = dynamic(() => import("react-select"), { ssr: false });

export default function CreateNoteComponent() {
  const [editorContent, setEditorContent] = useState(""); 
  const [title, setTitle] = useState(""); 
  const [reminderDates, setReminderDates] = useState([]); 
  const [remindersEnabled, setRemindersEnabled] = useState(true); 
  const [isLoading, setIsLoading] = useState(false); 
  const [notebooks, setNotebooks] = useState([]); 
  const [selectedNotebook, setSelectedNotebook] = useState(null); 

  const router = useRouter();
  const searchParams = useSearchParams();
  const noteBookIdFromURL = searchParams.get("noteBookId");

  const calculateDefaultDate = (daysInterval) => {
    const now = new Date();
    now.setHours(19, 0, 0, 0);
    now.setDate(now.getDate() + daysInterval);
    return now.toISOString().slice(0, 16);
  };

  const fetchNotebooks = async () => {
    try {
      const response = await getNotesBookService();
      const formattedNotebooks = response.data.map((notebook) => ({
        value: notebook._id,
        label: notebook.title,
      }));
      setNotebooks(formattedNotebooks);

      // Preselect the notebook if noteBookId is provided in the URL
      if (noteBookIdFromURL) {
        const preselectedNotebook = formattedNotebooks.find(
          (notebook) => notebook.value === noteBookIdFromURL
        );
        setSelectedNotebook(preselectedNotebook || null);
      }
    } catch (error) {
      console.error("Failed to fetch notebooks:", error);
      toast.error("Failed to load notebooks.");
    }
  };

  useEffect(() => {
    fetchNotebooks();
    const defaultDates = [1, 7, 15, 30, 45].map((interval) =>
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
    setReminderDates([...reminderDates, calculateDefaultDate(reminderDates.length + 1)]);
  };

  // Build the payload when the save button is clicked
  const handleSave = async () => {
    setIsLoading(true); // Set loading to true
    const payload = {
      title: title || "Sample Note",
      content: editorContent,
      noteBookID: selectedNotebook?.value || null,
      reminderEnabled: remindersEnabled && reminderDates.length > 0,
      upcomingReminders: remindersEnabled
        ? reminderDates.map((reminder) => ({
            reminderDate: reminder,
          }))
        : [], // Pass the upcoming reminders array if enabled
    };

    console.log("Payload to be sent:", payload);

    // Example: You can call an API to save the note here
    try {
      const res = await createNotesService(payload);
      router.push(`/pages/notes/edit/${res.data._id}`);
      toast.success("Notes successfully created!");
    } catch (error) {
      console.log(error);
      toast.error(
        error?.message?.response?.data?.data || "Notes creation failed"
      );
    } finally {
      setIsLoading(false); // Set loading to false
    }
  };

  return (
    <div className="flex flex-col md:flex-row mt-8 gap-4 px-4 md:px-8">
      <div className="w-full md:w-[80%] space-y-3 ">
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

      <div className="w-full md:w-[20%] bg-primary-50 h-fit p-2 rounded-md">
        <div className="mt-4 flex flex-col gap-1">
          <div className="mb-4">
            <label className="font-semibold mb-2 block">Select Notebook</label>
            <Select
              options={notebooks}
              value={selectedNotebook}
              onChange={setSelectedNotebook}
              placeholder="Choose notebook..."
            />
          </div>

          <label className="flex items-center font-semibold">
            <input
              type="checkbox"
              checked={remindersEnabled}
              onChange={handleRemindersEnabledChange}
              className="mr-2"
            />
            Enable Reminders
          </label>
          {remindersEnabled &&
            reminderDates.map((date, index) => (
              <div key={index} className="flex items-center gap-2">
                <InputCommon
                  type="datetime-local"
                  value={date} // Bind the date to the state
                  onChange={(e) => handleReminderChange(e, index)} // Handle reminder change
                />
                <p
                  className="cursor-pointer bg-red-100 p-2 rounded-md border-2 border-red-600 "
                  onClick={() => handleRemoveReminder(index)}
                >
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

        <ButtonCommon
          label="Save Changes"
          icon={<VscSaveAll size="20" />}
          className="w-full mt-4"
          onClick={handleSave}
          disabled={isLoading}
          isLoading={isLoading}
        />
      </div>

      <ToastContainer />
    </div>
  );
}
