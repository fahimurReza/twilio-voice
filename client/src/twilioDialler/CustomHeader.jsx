import React from "react";

function CustomHeader({ headline, className }) {
  return (
    <div
      className={`mb-3 flex justify-center p-4 text-gray-700 text-lg
      font-[500] bg-gradient-to-b from-blue-400 to-white h-[72px] ${
        className || ""
      }`}
    >
      {headline}
    </div>
  );
}

export default CustomHeader;
