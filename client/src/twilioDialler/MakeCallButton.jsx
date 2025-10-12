import { FaPhoneFlip } from "react-icons/fa6";

function MakeCallButton({ handleCall, callInProgress }) {
  return (
    <button
      onClick={handleCall}
      className={`px-4 py-4 rounded-full transition ${
        callInProgress ? "bg-red-500" : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      <FaPhoneFlip
        size={26}
        color="white"
        className={callInProgress ? "rotate-225" : ""}
      />
    </button>
  );
}

export default MakeCallButton;
