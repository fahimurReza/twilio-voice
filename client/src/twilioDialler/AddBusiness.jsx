import { useState } from "react";
import { MdDialpad } from "react-icons/md";
import CustomHeader from "./CustomHeader";
import NumberInput from "./NumberInput";
import BusinessList from "./BusinessList";

function AddBusiness({ onClose }) {
  const [isBusinessInputFocused, setIsBusinessInputFocused] = useState(false);

  return (
    <div className="flex flex-col items-center relative w-full">
      <CustomHeader
        headline={" Add a New Business"}
        className="w-full rounded-tr-md"
      />
      <div className="flex flex-col items-center mt-4">
        <input
          placeholder={"Name of the Business"}
          className="border rounded border-blue-400 w-60 h-9 placeholder:text-[18px] 
          text-center placeholder:text-gray-500 focus:outline-blue-400 focus:outline-1 
          focus:placeholder:text-[18px] focus:placeholder:text-gray-300 "
        />

        <NumberInput
          className="mt-3 w-60"
          inputClassName="border border-blue-400 h-9 rounded placeholder:text-base 
          focus:outline-1 focus:outline-blue-400"
          setOnFocus={() => setIsBusinessInputFocused(true)}
          setOnBlur={() => setIsBusinessInputFocused(false)}
          placeholder={
            isBusinessInputFocused ? "(999) 999-9999" : "Business Phone Number"
          }
        />
      </div>
      <button
        className="rounded px-4 h-9 mt-2 text-[18px] bg-blue-300 cursor-pointer 
      hover:bg-blue-400 border border-blue-500"
      >
        Submit
      </button>
      <BusinessList />
      <div
        onClick={onClose}
        className="p-3 w-13 h-13 cursor-pointer z-100 rounded-full bg-blue-400 absolute 
        bottom-8 right-8 hover:bg-blue-500"
      >
        <MdDialpad size={28} />
      </div>
    </div>
  );
}

export default AddBusiness;
