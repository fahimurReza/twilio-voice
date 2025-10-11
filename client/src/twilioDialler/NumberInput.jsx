import React from "react";

function NumberInput({
  rawInput,
  isInputFocused,
  setIsInputFocused,
  handleInputChange,
  handleInputEnter,
}) {
  return (
    <div>
      <div className="flex items-center w-60 mb-2 rounded focus-within:border-gray-400 hover:border-gray-400">
        <span
          className={`pl-9 pr-1 text-[18px] font-semibold text-gray-700 ${
            rawInput ? "opacity-100 pl-11" : "opacity-0"
          }`}
        >
          +1
        </span>
        <input
          type="text"
          value={rawInput || ""}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          onChange={handleInputChange}
          onKeyDown={handleInputEnter}
          placeholder={isInputFocused ? "999-999-9999" : "Enter a number"}
          className={`flex-1 pr-4 py-2 text-[18px] font-semibold placeholder:text-lg bg-transparent
            placeholder:font-normal placeholder:text-gray-500 focus:outline-none 
            focus:placeholder:text-[18px] focus:placeholder:text-gray-300`}
        />
      </div>
    </div>
  );
}

export default NumberInput;
