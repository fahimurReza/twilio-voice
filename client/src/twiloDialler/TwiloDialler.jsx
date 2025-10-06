import React from "react";
import { useEffect, useState } from "react";
import { Device } from "@twilio/voice-sdk";

import DialPad from "../dialPad/DialPad";

const TwiloDialler = () => {
  const [device, setDevice] = useState(null);
  const [callInProgress, setCallInProgress] = useState(false);
  const [dialedNumber, setDialedNumber] = useState("");

  const setupDevice = (device) => {
    device.on("ready", () => console.log("Device ready"));
    device.on("error", (err) => console.error(err));
  };

  useEffect(() => {
    fetch("https://twilio-voice-backend-f5sm.onrender.com/token")
      .then((res) => res.json())
      .then((data) => {
        const newDevice = new Device(data.token, { debug: true });
        setupDevice(newDevice);
        setDevice(newDevice);
      })
      .catch((err) => console.error(err));
  }, []);

  const makeCall = async (number) => {
    if (!device) {
      console.log("Device not ready yet!");
      return;
    }

    try {
      setCallInProgress(true); // Set immediately when starting outgoing call
      const connection = await device.connect({
        params: { To: number },
      });

      // Listen for the disconnect of this connection
      connection.on("stateChanged", (state) => {
        if (state === "closed") {
          setCallInProgress(false);
        }
      });
    } catch (err) {
      console.error("Call failed:", err);
      setCallInProgress(false);
    }
  };

  const hangUpCall = () => {
    if (device) {
      device.disconnectAll();
      setCallInProgress(false);
    }
  };

  const handleDialPress = (digit) => {
    setDialedNumber((prev) => prev + digit);
  };

  const handleClear = () => {
    setDialedNumber("");
  };

  return (
    <div className="App flex flex-col justify-center items-center h-screen">
      <h1 className="mb-4 text-2xl font-bold">Twilio Voice Client</h1>
      {/* Number Display */}
      <input
        type="text"
        value={dialedNumber}
        readOnly
        placeholder="Enter number"
        className="mb-4 px-4 py-2 w-48 text-center border rounded text-lg"
      />
      <DialPad onPress={handleDialPress} />
      {/* Clear Button */}
      <button
        onClick={handleClear}
        className="mb-4 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
      >
        Clear
      </button>
      <div>
        <button
          onClick={() => makeCall(dialedNumber)}
          disabled={!device || callInProgress}
          className="mr-2 px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
        >
          Make a Call
        </button>
        <button
          onClick={hangUpCall}
          disabled={!device || !callInProgress}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-400"
        >
          Hang Up
        </button>
      </div>
    </div>
  );
};

export default TwiloDialler;
