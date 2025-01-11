"use client";

import React, { useEffect, useState } from "react";
import ButtonCommon from "@/app/components/commonComponents/ButtonCommon";
import { FaClock, FaCheckCircle, FaTimesCircle, FaBookReader } from "react-icons/fa";
import { dashboardRevisionListService } from "@/app/services/notes";

const Page = () => {
  const [revisionNotes, setRevisionNotes] = useState({
    notesForRevisionToday: [],
    pastNotesForRevision: [],
  });

  const fetchRevisionNotes = async () => {
    try {
      const response = await dashboardRevisionListService();
      if (response.success) {
        setRevisionNotes(response.data);
      }
    } catch (error) {
      console.error("Error fetching revision notes:", error);
    }
  };

  useEffect(() => {
    fetchRevisionNotes();
  }, []);

  const handleReviseNow = (noteId) => {
    window.location.href = `/pages/notes/read/${noteId}`;
  };

  const { notesForRevisionToday, pastNotesForRevision } = revisionNotes;

  const renderNoteCard = (note) => (
    <div className="bg-white shadow rounded-lg p-4 mb-4 border border-neutral-200 flex justify-between items-start">
      <div className="flex-1">
        <h3 className="text-lg font-medium text-neutral-800">{note.noteTitle}</h3>
        <p className="text-sm text-neutral-500 mt-2 flex items-center">
          <FaClock className="mr-1 text-primary-500" size={"14"} />
          {new Date(note.reminderHistory.reminderDate).toLocaleDateString()} -{" "}
          {note.reminderHistory.reminderTime}
        </p>
        <p className="text-sm text-neutral-500 mt-1 flex items-center">
          {note.reminderHistory.isRevisionDone ? (
            <FaCheckCircle className="mr-1 text-success-500" size={"14"} />
          ) : (
            <FaTimesCircle className="mr-1 text-danger-500" size={"14"} />
          )}
          {note.reminderHistory.isRevisionDone ? "Revision Done" : "Revision Pending"}
        </p>
      </div>
      <ButtonCommon
        onClick={() => handleReviseNow(note.otherDetails.noteId)}
        label="Revise Now"
        icon={<FaBookReader />}
        className="ml-4"
      />
    </div>
  );

  return (
    <div className=" min-h-screen p-6">

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-primary-600 mb-4">Today's Notes</h2>
        {notesForRevisionToday.length > 0 ? (
          notesForRevisionToday.map((note, index) => (
            <React.Fragment key={index}>{renderNoteCard(note)}</React.Fragment>
          ))
        ) : (
          <p className="text-sm text-neutral-500">No notes for today.</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold text-primary-600 mb-4">Past Notes</h2>
        {pastNotesForRevision.length > 0 ? (
          pastNotesForRevision.map((note, index) => (
            <React.Fragment key={index}>{renderNoteCard(note)}</React.Fragment>
          ))
        ) : (
          <p className="text-sm text-neutral-500">No past notes available.</p>
        )}
      </div>
    </div>
  );
};

export default Page;
