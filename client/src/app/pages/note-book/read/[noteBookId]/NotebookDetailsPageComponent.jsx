"use client";

import ButtonCommon from "@/app/components/commonComponents/ButtonCommon";
import { getNotesBookByIdService } from "@/app/services/noteBook";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { LuNotebookPen } from "react-icons/lu";
import { PiUploadSimpleBold } from "react-icons/pi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function NotebookDetailsPageComponent() {
  const router = useRouter();
  const { noteBookId } = useParams();
  const [notebook, setNotebook] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (noteBookId) {
      fetchNotebookDetails();
    }
  }, [noteBookId]);

  const fetchNotebookDetails = async () => {
    try {
      const response = await getNotesBookByIdService(noteBookId);
      setNotebook(response?.data?.notebook);
      setNotes(response?.data?.notes);
      console.table(response?.data?.notes);
    } catch (error) {
      console.error("Error fetching notebook details:", error);
      toast.error("Failed to fetch notebook details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRedirectToCreateNotes = () => {
    router.push(`/pages/create?noteBookId=${noteBookId}`);
  };

  return (
    <div className="p-6 bg-background min-h-screen">
      <h1 className="text-primary-500 text-2xl font-bold mb-6">
        Notebook Details
      </h1>

      {loading ? (
        <p className="text-primary-300">Loading notebook details...</p>
      ) : notebook ? (
        <div className="bg-white shadow-md rounded-lg p-6 ">
          <div className="inline-flex w-[100%] justify-between items-start border-b-2  ">
            <div className="">
              <h2 className="text-primary-500 text-3xl font-semibold mb-2">
                {notebook.title}
              </h2>
              <p className="text-neutral-600 text-sm">
                Created At: {new Date(notebook.createdAt).toLocaleDateString()}
              </p>
              <p className="text-neutral-500 text-sm mb-4">
                Status:{" "}
                <span
                  className={`${
                    notebook.status === "active"
                      ? "text-success-500"
                      : "text-danger-500"
                  } font-semibold`}
                >
                  {notebook.status}
                </span>
              </p>
            </div>

            <div className="">
              <ButtonCommon
                icon={<PiUploadSimpleBold size={20} />}
                label="Upload Files"
                onClick={() => alert("Upload functionality to be implemented")}
                className=" mr-4 "
              />

              <ButtonCommon
                label="Write Notes"
                variant="solid"
                onClick={handleRedirectToCreateNotes}
                icon={<LuNotebookPen size={20} />}
                className=""
              />
            </div>
          </div>
          <h3 className="text-primary-400 text-xl font-bold mt-4 mb-2">
            Notes:
          </h3>
          {notes.length > 0 ? (
            <div className="space-y-4">
              {notes.map((note) => (
                <div
                  key={note._id}
                  className="p-4 bg-neutral-50 rounded-lg shadow border border-neutral-200"
                >
                  <h4 className="text-primary-500 text-lg font-semibold">
                    {note.title}
                  </h4>
                  <p className="text-neutral-400 text-sm mt-2">
                    Created At: {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                  <p
                    className={`text-sm font-semibold ${
                      note.status === "active"
                        ? "text-success-500"
                        : "text-danger-500"
                    }`}
                  >
                    Status: {note.status}
                  </p>
                  <div className="mt-2 flex gap-4">
                    <ButtonCommon
                      label="Read"
                      onClick={() =>
                        (window.location.href = `http://localhost:3000/pages/notes/read/${note._id}`)
                      }
                    />
                    <ButtonCommon
                      label="Edit"
                      onClick={() =>
                        (window.location.href = `http://localhost:3000/pages/notes/edit/${note._id}`)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-500">
              No notes available for this notebook.
            </p>
          )}
        </div>
      ) : (
        <p className="text-neutral-500">Notebook not found.</p>
      )}

      <ToastContainer />
    </div>
  );
}
