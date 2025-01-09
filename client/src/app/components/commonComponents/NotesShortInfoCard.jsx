"use client";

import React from "react";
import ButtonCommon from "./ButtonCommon";
import { FaRegEdit } from "react-icons/fa";
import { FaBookReader } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function NotesShortInfoCard({ title, content, id }) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/pages/notes/edit/${id}`); // Use dynamic note ID for edit route
  };

  const handleRead = () => {
    router.push(`/pages/notes/read/${id}`); // Use dynamic note ID for read route
  };

  return (
    <div className="border p-2 rounded-md h-[200px] w-[100%] max-w-[345px] flex flex-col justify-between">
      <div className="w-[100%]" >
        <h2 className="text-[20px] font-semibold">{title}</h2> {/* Render dynamic title */}
        <p className="text-gray-500">{content}</p> {/* Render dynamic content */}
      </div>

      <div className="w-[100%] min-w-[330px]  flex gap-2">
        <ButtonCommon
          variant="outline"
          label="Edit"
          className="w-[50%]"
          icon={<FaRegEdit />}
          onClick={handleEdit}
        />
        <ButtonCommon
          variant="outline"
          label="Read"
          className="w-[50%]"
          icon={<FaBookReader />}
          onClick={handleRead}
        />
      </div>
    </div>
  );
}
