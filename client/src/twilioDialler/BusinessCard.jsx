import { FaHouseUser } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";

function BusinessCard() {
  return (
    <div
      className="pl-4 pr-5 py-1 flex items-center w-full border-b border-blue-300
    rounded-md group hover:bg-blue-100"
    >
      <div
        className="h-8 w-8 p-[6px] pr-[2px] rounded-full bg-blue-200 
      group-hover:bg-white group-hover:border group-hover:border-blue-300"
      >
        <FaHouseUser size={18} />
      </div>
      <div className="pl-2">Asheboro Tree</div>
      <div className="ml-auto text-[14px] group-hover:hidden">
        (307) 207-7080
      </div>
      <div className="ml-auto rounded-md justify-center items-center w-8 h-8 cursor-pointer hidden group-hover:flex bg-white border border-red-200">
        <MdDelete size={24} color="#ef4444" />
      </div>
    </div>
  );
}

export default BusinessCard;
