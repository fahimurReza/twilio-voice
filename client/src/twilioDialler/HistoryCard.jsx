import { BsPersonFill } from "react-icons/bs";
import { FaPhoneFlip } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { useDispatch } from "react-redux";
import { removeCall, setCallInput } from "../store/store";

function HistoryCard({ call, index }) {
  const dispatch = useDispatch();

  const handleDelete = () => {
    dispatch(removeCall(index));
  };

  const handleCall = () => {
    const fromNumber =
      [
        { label: "Asheboro Tree", value: "+13365230067" },
        { label: "Plano Concrete", value: "+14694094540" },
        { label: "Texarkana Tree", value: "+18706002037" },
      ].find((bus) => bus.label === call.business)?.value || "";

    dispatch(
      setCallInput({
        phoneNumber: call.phoneNumber,
        fromNumber,
        startCall: true, // CHANGE: Set startCall to true to trigger auto-call
      })
    );
  };

  return (
    <div>
      <div className="mx-3 py-1 px-3 rounded-md flex items-center hover:bg-blue-50 group">
        <div className="rounded-md bg-blue-100 group-hover:bg-white group-hover:border group-hover:border-blue-300 flex justify-center items-center w-10 h-10">
          <BsPersonFill size={20} />
        </div>
        <div className="ml-3 h-12 flex flex-col justify-center">
          <div className="text-base">{call.phoneNumber}</div>
          <div className="text-[13px] text-gray-600">{call.business}</div>
        </div>
        <div
          className="ml-auto rounded-md justify-center items-center w-10 h-10 cursor-pointer hidden group-hover:flex bg-white border border-red-200"
          onClick={handleDelete}
        >
          <MdDelete size={24} color="#ef4444" />
        </div>
        <div
          className="ml-2 rounded-lg justify-center items-center w-10 h-10 cursor-pointer hidden group-hover:flex bg-white border border-blue-300"
          onClick={handleCall}
        >
          <FaPhoneFlip size={18} color="#2563eb" />
        </div>
        <div className="ml-auto h-12 flex flex-col justify-center group-hover:hidden">
          <div className="text-[13px] text-gray-600 text-right">
            {call.date}
          </div>
          <div className="text-base text-right text-gray-600">{call.time}</div>
        </div>
      </div>
    </div>
  );
}

export default HistoryCard;
