import { BsPersonFill } from "react-icons/bs";
import { FaPhoneFlip } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { removeCall, setCallInput } from "../store/store";

function HistoryCard({ record, index }) {
  const dispatch = useDispatch();
  const businesses = useSelector((state) => state.calls.businesses);

  const handleDelete = () => {
    dispatch(removeCall(index));
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

  return (
    <div>
      <div
        className="mx-3 py-1 px-3 rounded-md flex items-center hover:bg-blue-100 
        group border-b border-blue-300"
      >
        <div
          className="rounded-md bg-blue-200 group-hover:bg-white group-hover:border 
        group-hover:border-blue-300 flex justify-center items-center w-10 h-10"
        >
          <BsPersonFill size={26} />
        </div>
        <div className="ml-3 h-12 flex flex-col justify-center">
          <div className="text-base">{record.phoneNumber}</div>
          <div className="text-[13px] text-gray-600">{record.business}</div>
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
