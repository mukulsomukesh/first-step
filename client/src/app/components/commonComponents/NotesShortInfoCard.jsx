"use client"

import React from "react";
import ButtonCommon from "./ButtonCommon";
import { FaRegEdit } from "react-icons/fa";
import { FaBookReader } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function NotesShortInfoCard() {

  const router = useRouter();

  const handleEdit = () => {
    router.push(`/pages/notes/edit/12345678`);
  };

  const handleRead = () => {
    router.push("/pages/notes/read/12345678");
  };


  return (
    <>
      <div className="border p-2 rounded-md h-[200px] w-[100%] max-w-[345px]  flex flex-col justify-between ">
        <div>
          <h2 className="text-[20px] font-semibold "> Trip Planning </h2>
          <p className=" text-gray-500 " >Itinerary and budget for summer vacation.</p>
        </div>

        <div className="w-[100%] flex gap-2 ">
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
    </>
  );
}
