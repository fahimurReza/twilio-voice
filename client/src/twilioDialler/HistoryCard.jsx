import { BsPersonFill } from "react-icons/bs";
import { FaPhoneFlip } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";

function HistoryCard({ call }) {
  return (
    <div>
      <div className="mx-3 py-1 px-3 rounded-md flex items-center hover:bg-gray-50 group">
        <div className="rounded-md bg-blue-100 flex justify-center items-center w-10 h-10">
          <BsPersonFill size={20} />
        </div>
        <div className="ml-3 h-12 flex flex-col justify-center">
          <div className="text-base">{call.phoneNumber}</div>
          <div className="text-[13px] text-gray-600">{call.business}</div>
        </div>
        <div
          className="ml-auto rounded-md justify-center items-center w-10 h-10  
        cursor-pointer hidden group-hover:flex bg-red-50 border border-red-200"
        >
          <MdDelete size={24} color="#ef4444" />
        </div>
        <div
          className="ml-2 rounded-lg justify-center items-center w-10 h-10 
        cursor-pointer hidden group-hover:flex bg-green-100 border border-green-300"
        >
          <FaPhoneFlip size={18} color="#15803d" />
        </div>
        <div className="ml-auto h-12 flex flex-col justify-center group-hover:hidden">
          <div className="text-[13px] text-gray-600 text-right">
            {call.date}
          </div>
          <div className="text-base text-righ text-gray-600">{call.time}</div>
        </div>
      </div>
    </div>
  );
}

export default HistoryCard;
