import { useState, useEffect, useRef } from "react";
import { BsPersonFill } from "react-icons/bs";
import { FaPhoneFlip } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { formatIncomingNumber, formatDuration } from "../utils";
import "../style/incomingWindow.css";

function IncomingWindow({
  incomingPhoneNumber,
  incomingTwilioNumber,
  acceptIncoming,
  rejectIncoming,
  acceptedRef,
}) {
  const [callDuration, setCallDuration] = useState(0);
  const startTimeRef = useRef(null);
  const timerRef = useRef(null);

  const businesses = useSelector((state) => state.calls.businesses);

  const business = businesses.find(
    (bus) => bus.number === formatIncomingNumber(incomingTwilioNumber)
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleAccept = () => {
    acceptIncoming();
    if (!timerRef.current) {
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        const now = Date.now();
        setCallDuration(Math.floor((now - startTimeRef.current) / 1000));
      }, 1000);
    }
  };

  const handleReject = () => {
    rejectIncoming();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      startTimeRef.current = null;
      setCallDuration(0);
    }
  };

  return (
    <div className="incoming-window h-[555px] w-full px-6 text-center">
      <div className="p-4 rounded-2xl bg-white mt-18">
        <div className="rounded-xl bg-blue-100 flex justify-center items-center w-24 h-24">
          <BsPersonFill size={64} />
        </div>
      </div>
      <p className="mt-6 text-3xl font-bold">
        {formatIncomingNumber(incomingPhoneNumber) || "(888) 999-3333"}
      </p>
      <p className="mb-4 text-lg font-semibold">
        Business - {business?.name || "Texarkana Tree"}
      </p>
      <div className="h-1">
        {acceptedRef.current && (
          <p className="mb-4 text-lg">{formatDuration(callDuration)}</p>
        )}
      </div>
      <div
        className={`relative mt-28 flex gap-24 w-full px-18 transition-all justify-center`}
      >
        <button
          onClick={handleReject}
          className={`absolute px-4 py-4 rounded-full focus:outline-none cursor-pointer 
          bg-red-500 rotate-225 hover:bg-red-600 transition-transform duration-500 
          ease-in-out ${
            acceptedRef.current
              ? "translate-x-0 scale-110"
              : "-translate-x-18 scale-100"
          }`}
        >
          <FaPhoneFlip size={26} color="white" />
        </button>
        <button
          onClick={handleAccept}
          className={`absolute px-4 py-4 rounded-full focus:outline-none cursor-pointer 
          bg-blue-600 hover:bg-blue-800 transition-all duration-500 ease-in-out ${
            acceptedRef.current
              ? "opacity-0 scale-90 translate-x-0 pointer-events-none"
              : "opacity-100 scale-100 translate-x-18"
          }`}
        >
          <FaPhoneFlip size={26} color="white" />
        </button>
      </div>
    </div>
  );
}

export default IncomingWindow;
