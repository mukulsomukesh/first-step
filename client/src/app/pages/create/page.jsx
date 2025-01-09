import ButtonCommon from "@/app/components/commonComponents/ButtonCommon";
import InputCommon from "@/app/components/commonComponents/InputCommon";
import TextEditor from "@/app/components/commonComponents/TextEditor";
import React from "react";
import { VscSaveAll } from "react-icons/vsc";
import { TbUserShare } from "react-icons/tb";

export default function page() {
  return (
    <div className="flex mt-4 gap-4 px-8 ">
      <div className="w-[80%]">
        {" "}
        <TextEditor />{" "}
      </div>

      <div className="w-[20%] bg-primary-50 h-fit p-2 rounded-md ">
        <div className="mt-4 flex flex-col gap-1 ">
          <p className="text-[18px] font-semibold "> Upcoming Reminders </p>
          <InputCommon type="datetime-local" />
          <InputCommon type="datetime-local" />
          <InputCommon type="datetime-local" />
          <InputCommon type="datetime-local" />
          <InputCommon type="datetime-local" />
        </div>

        <ButtonCommon
          label="Share Notes"
          icon={<TbUserShare size="20" />}
          className="w-[100%] mt-2"
          variant="outline"
        />

        <ButtonCommon
          label="Save Changes"
          icon={<VscSaveAll size="20" />}
          className="w-[100%] mt-2"
        />
      </div>
    </div>
  );
}
