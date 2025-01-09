"use client";

import React from "react";
import ButtonCommon from "./ButtonCommon";
import { FaRegEdit } from "react-icons/fa";
import { FaBookReader } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NotesShortInfoCard({ title, content, id }) {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/pages/notes/edit/${id}`);
  };

  const handleRead = () => {
    router.push(`/pages/notes/read/${id}`);
  };

  // Utility functions
  const getPreview = (content, maxLength = 150) => {
    const div = document.createElement("div");
    div.innerHTML = content;
    const text = div.textContent || div.innerText || "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  const getFirstImage = (content) => {
    const div = document.createElement("div");
    div.innerHTML = content;
    const img = div.querySelector("img");
    return img ? img.src : null;
  };

  const previewText = getPreview(content);
  const imageUrl = getFirstImage(content);

  return (
    <div className="border p-2 rounded-md h-[220px] w-[100%] max-w-[345px] flex flex-col justify-between">
      <div className="w-[100%] overflow-hidden">
      <h2 className="text-[20px] font-semibold line-clamp-2">{title}</h2>
      {imageUrl ? (
          <Image
            src={imageUrl}
            alt="Note preview"
            width={80}
            height={24}
            className="w-full h-[80px] object-cover rounded-md mb-2"
          />
        ) : null}
        <p className="text-gray-500 line-clamp-3 ">{previewText}</p>
      </div>

      <div className="w-[100%] bg-white mt-2 min-w-[330px] flex gap-2">
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
