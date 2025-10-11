import React from "react";
import { FaPhoneAlt } from "react-icons/fa";

function MakeCallButton({ handleCall, callInProgress }) {
  return (
    <button
      onClick={handleCall}
      className={`px-4 py-4 rounded-full transition ${
        callInProgress ? "bg-red-500" : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      <FaPhoneAlt
        size={25}
        color="white"
        className={callInProgress ? "rotate-135" : ""}
      />
    </button>
  );
}

export default MakeCallButton;
