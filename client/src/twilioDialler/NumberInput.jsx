import React from "react";

function NumberInput({
  rawInput,
  isInputFocused,
  setIsInputFocused,
  handleInputChange,
  handleInputEnter,
  className,
  inputClassName,
  placeholder,
  setOnFocus,
  setOnBlur,
}) {
  return (
    <div>
      <div className={`flex items-center w-58 mb-2 ${className || ""}`}>
        <input
          type="text"
          value={rawInput || ""}
          onFocus={setOnFocus}
          onBlur={setOnBlur}
          onChange={handleInputChange}
          onKeyDown={handleInputEnter}
          placeholder={
            placeholder ||
            (isInputFocused ? "(999) 999-9999" : "Enter a number")
          }
          className={`flex-1 py-2 text-[18px] font-semibold placeholder:text-lg bg-transparent
            placeholder:font-normal placeholder:text-gray-500 focus:placeholder:text-[18px] 
            text-center rounded focus:placeholder:text-gray-300 ${
              inputClassName || ""
            }`}
        />
      </div>
    </div>
  );
}

export default NumberInput;
