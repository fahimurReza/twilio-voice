import React from "react";
import { FaBackspace } from "react-icons/fa";

function DeleteButton({ handleDelete, inputValue }) {
  return (
    <button
      onClick={handleDelete}
      className={`absolute right-16 transition-opacity duration-300 ${
        inputValue
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <FaBackspace size={30} color="gray" />
    </button>
  );
}

export default DeleteButton;
