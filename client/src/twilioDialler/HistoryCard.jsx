import { useSelector, useDispatch } from "react-redux";
import { removeCallHistory, setCallInput } from "../store/store";
import { BsPersonFill } from "react-icons/bs";
import { FaPhoneFlip } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { HiOutlineChevronDoubleUp } from "react-icons/hi";

function HistoryCard({ record, index }) {
  const dispatch = useDispatch();
  const businesses = useSelector((state) => state.calls.businesses);

  const handleDelete = () => {
    dispatch(removeCallHistory(index));
  };

  const handleCall = () => {
    const business = businesses.find(
      (business) => business.name === record.business
    );
    const fromNumber = business?.number || "";
    const toNumber = record.phoneNumber;
    dispatch(
      setCallInput({ phoneNumber: toNumber, fromNumber, startCall: true })
    );
  };

  const isMissed = record.type === "incoming" && record.status === "missed";
  const isRejected = record.type === "incoming" && record.status === "rejected";
  const isIncoming = record.type === "incoming";

  return (
    <div>
      <div
        className="mx-3 py-1 pr-3 rounded-md flex items-center hover:bg-blue-100 
        group border-b border-blue-300"
      >
        <div
          className={`${
            record.type === "outgoing" ? "pr-2" : "rotate-180 pl-2"
          }`}
        >
          <HiOutlineChevronDoubleUp color={`${isIncoming ? "blue" : ""}`} />
        </div>
        <div
          className="rounded-md bg-blue-200 group-hover:bg-white group-hover:border 
        group-hover:border-blue-300 flex justify-center items-center w-10 h-10"
        >
          <BsPersonFill size={26} />
        </div>
        <div
          className={`ml-3 h-12 flex flex-col justify-center ${
            isMissed || isRejected ? "text-red-500" : ""
          }`}
        >
          <div className="text-base">{record.phoneNumber}</div>
          <div className="text-[13px] text-gray-600">
            {record.business}
            <span>
              - {isMissed || isRejected ? record.status : record.duration}
            </span>
          </div>
        </div>
        <div
          className="ml-auto rounded-md justify-center items-center w-9 h-9 cursor-pointer 
          hidden group-hover:flex bg-white border border-red-200"
          onClick={handleDelete}
        >
          <MdDelete size={24} color="#ef4444" />
        </div>
        <div
          className="ml-2 rounded-lg justify-center items-center w-9 h-9 cursor-pointer 
          hidden group-hover:flex bg-white border border-blue-300"
          onClick={handleCall}
        >
          <FaPhoneFlip size={18} color="#2563eb" />
        </div>
        <div className="ml-auto h-12 flex flex-col justify-center group-hover:hidden">
          <div className="text-base text-right text-gray-600">
            {record.time}
          </div>
          <div className="text-[13px] text-gray-600 text-right">
            {record.date}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HistoryCard;
