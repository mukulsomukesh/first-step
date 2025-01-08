"use client";

import ButtonCommon from "@/app/components/commonComponents/ButtonCommon";
import NotesShortInfoCard from "@/app/components/commonComponents/NotesShortInfoCard";
import React from "react";
import { FaNotesMedical } from "react-icons/fa6";
import { useRouter } from "next/navigation";

let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function Home() {
  const router = useRouter();

  const handleRedirectToCreateNotes = () => {
    router.push(`/pages/create`);
  };

  return (
    <div className="px-8 py-4">
      <ButtonCommon
        label="Create New Note"
        variant="solid"
        onClick={handleRedirectToCreateNotes}
        icon={<FaNotesMedical />}
      />

      <div className=" flex flex-wrap justify-center mt-8 gap-4 w-fit  ">
        {arr.map(() => (
          <NotesShortInfoCard />
        ))}
      </div>
    </div>
  );
}
