import { BsPersonFill } from "react-icons/bs";
import { FaPhoneFlip } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { formatIncomingNumber } from "../utils";
import "../style/incomingWindow.css";

function IncomingWindow({
  incomingPhoneNumber,
  incomingTwilioNumber,
  acceptIncoming,
  rejectIncoming,
}) {
  const businesses = useSelector((state) => state.calls.businesses);
  const formatedTwilioNumber = formatIncomingNumber(incomingTwilioNumber);
  const business = businesses.find(
    (bus) => bus.number === formatedTwilioNumber
  );

  return (
    <div className="incoming-window h-[555px]">
      <div className="p-5 rounded-2xl bg-white mt-18">
        <div className="rounded-2xl bg-blue-100 flex justify-center items-center w-24 h-24">
          <BsPersonFill size={60} />
        </div>
      </div>

      <p className="mt-6 text-3xl font-bold">
        {formatIncomingNumber(incomingPhoneNumber) || "Unknown"}
      </p>
      <p className="mb-4 font-semibold">{business?.name || "Unknown"}</p>
      <div className="space-x-20 mt-28">
        <button
          onClick={rejectIncoming}
          className={`px-4 py-4 rounded-full transition focus:outline-none cursor-pointer 
          bg-red-500 rotate-225 hover:bg-red-600`}
        >
          <FaPhoneFlip size={26} color="white" />
        </button>
        <button
          onClick={acceptIncoming}
          className={`px-4 py-4 rounded-full transition focus:outline-none cursor-pointer 
          bg-blue-600 hover:bg-blue-800`}
        >
          <FaPhoneFlip size={26} color="white" />
        </button>
      </div>
    </div>
  );
}

export default IncomingWindow;
