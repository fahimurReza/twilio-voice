import { FaHouseUser } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";

function BusinessCard({ name, number, onDelete, index }) {
  return (
    <div
      className="pl-4 pr-7 py-1 h-[40px] flex items-center w-full border-b border-blue-300
      group hover:bg-blue-100"
    >
      <div className="mr-1">
        <FaHouseUser size={20} />
      </div>
      <div className="pl-2">{name}</div>
      <div className="ml-auto text-sm group-hover:hidden">{number}</div>
      <div
        onClick={() => onDelete(index)}
        className="ml-auto rounded-md justify-center items-center w-8 h-8 cursor-pointer 
        hidden group-hover:flex bg-white border border-red-200"
      >
        <MdDelete size={20} color="#ef4444" />
      </div>
    </div>
  );
}

export default BusinessCard;
