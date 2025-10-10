import { BsPersonFill } from "react-icons/bs";
import { FaPhoneFlip } from "react-icons/fa6";

function HistoryCard() {
  return (
    <div>
      <div className="mt-3 mx-3 py-1 px-3 rounded-md flex items-center hover:bg-gray-50 group">
        <div className="rounded-md bg-gray-200 flex justify-center items-center w-10 h-10">
          <BsPersonFill size={20} />
        </div>
        <div className="ml-3 h-12 flex flex-col justify-center">
          <div className="text-base">(323) 454-7766</div>
          <div className="text-[13px] text-gray-600">Plano Concrete</div>
        </div>
        <div
          className="ml-auto rounded-md flex justify-center items-center w-7 h-7 
        cursor-pointer opacity-0 group-hover:opacity-100 hover:bg-gray-200"
        >
          <FaPhoneFlip size={16} />
        </div>
        <div className="ml-3 h-12 flex flex-col justify-center">
          <div className="text-[13px] text-gray-600 text-right">Yesterday</div>
          <div className="text-base text-righ text-gray-600">12:48 PM</div>
        </div>
      </div>
    </div>
  );
}

export default HistoryCard;
