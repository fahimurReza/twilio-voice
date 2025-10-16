import React from "react";
import "../style/incomingWindow.css";

function IncomingWindow({
  incomingPhoneNumber,
  incomingTwilioNumber,
  acceptIncoming,
  rejectIncoming,
}) {
  return (
    <div className="incoming-window">
      <div className="bg-white p-6 rounded-lg text-center">
        <h3 className="text-lg font-bold mb-4">Incoming Call</h3>
        <p className="mb-2">To: {incomingTwilioNumber || "Unknown"}</p>
        <p className="mb-4">From: {incomingPhoneNumber || "Unknown"}</p>
        <div className="space-x-4">
          <button
            onClick={acceptIncoming}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Accept
          </button>
          <button
            onClick={rejectIncoming}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

export default IncomingWindow;
