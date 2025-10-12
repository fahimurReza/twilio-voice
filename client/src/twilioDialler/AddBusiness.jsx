import { useState } from "react";
import { useDispatch } from "react-redux";
import { MdDialpad } from "react-icons/md";
import { formatNumber } from "../utils";
import { addBusiness } from "../store/store";
import CustomHeader from "./CustomHeader";
import NumberInput from "./NumberInput";
import BusinessList from "./BusinessList";

function AddBusiness({ CloseAddBusiness }) {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [businessNumber, setBusinessNumber] = useState("");
  const [businessName, setBusinessName] = useState("");

  const dispatch = useDispatch();

  const handleNumberChange = (e) => {
    const allDigits = e.target.value.replace(/\D/g, "");
    let phoneDigits = allDigits;
    if (allDigits.length > 10 && allDigits.startsWith("1")) {
      phoneDigits = allDigits.slice(1, 11);
    } else {
      phoneDigits = allDigits.slice(0, 10);
    }
    setBusinessNumber(formatNumber(phoneDigits));
  };

  const handleNameChange = (e) => {
    setBusinessName(e.target.value);
  };

  const handleInputEnter = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (businessNumber && businessName) {
      dispatch(addBusiness({ name: businessName, number: businessNumber }));
      setBusinessNumber("");
      setBusinessName("");
    }
  };

  return (
    <div className="flex flex-col items-center relative w-full">
      <CustomHeader
        headline={" Add a New Business"}
        className="w-full rounded-tr-md"
      />
      <div className="flex flex-col items-center mt-4">
        <input
          value={businessName}
          onChange={handleNameChange}
          placeholder={"Name of the Business"}
          maxLength={22}
          className="border rounded border-blue-400 w-60 h-9 placeholder:text-[18px] 
          text-center placeholder:text-gray-500 focus:outline-blue-400 focus:outline-1 
          focus:placeholder:text-[18px] focus:placeholder:text-gray-300 
          text-gray-600 text-lg"
        />

        <NumberInput
          setOnFocus={() => setIsInputFocused(true)}
          setOnBlur={() => setIsInputFocused(false)}
          handleInputChange={handleNumberChange}
          handleInputEnter={handleInputEnter}
          inputValue={businessNumber}
          className="mt-3 w-60"
          inputClassName="border border-blue-400 h-9 rounded placeholder:text-base 
          focus:outline-1 focus:outline-blue-400 text-gray-600 text-lg"
          placeholder={
            isInputFocused ? "(999) 999-9999" : "Business Phone Number"
          }
        />
      </div>
      <button
        onClick={handleSubmit}
        className="rounded px-4 h-9 mt-2 text-[18px] bg-blue-300 cursor-pointer 
      hover:bg-blue-400 border border-blue-500"
      >
        Submit
      </button>
      <BusinessList />
      <div
        onClick={CloseAddBusiness}
        className="p-3 w-13 h-13 cursor-pointer z-100 rounded-full bg-blue-400 absolute 
        bottom-8 right-8 hover:bg-blue-500"
      >
        <MdDialpad size={28} />
      </div>
    </div>
  );
}

export default AddBusiness;
