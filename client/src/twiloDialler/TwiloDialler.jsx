import React, { useEffect, useState, useRef } from "react";
import { Device } from "@twilio/voice-sdk";
import DialPad from "../dialPad/DialPad";
import { FaPhoneAlt } from "react-icons/fa";

const TwiloDialler = () => {
  const [device, setDevice] = useState(null);
  const [callInProgress, setCallInProgress] = useState(false);
  const [rawInput, setRawInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  // Store active Call instance
  const activeCall = useRef(null);

  // Setup Twilio Device
  useEffect(() => {
    fetch("https://twilio-voice-backend-f5sm.onrender.com/token")
      .then((res) => res.json())
      .then((data) => {
        const newDevice = new Device(data.token, { debug: true });
        newDevice.on("ready", () => console.log("Device ready"));
        newDevice.on("error", (err) => console.error("Device error:", err));
        setDevice(newDevice);
      })
      .catch((err) => console.error(err));
  }, []);

  // Format digits as (XXX) XXX-XXXX
  const formatNumber = (digits) => {
    if (!digits) return "";
    const area = digits.slice(0, 3);
    const part1 = digits.slice(3, 6);
    const part2 = digits.slice(6, 10);
    if (digits.length <= 3) return `(${area}`;
    if (digits.length <= 6) return `(${area}) ${part1}`;
    return `(${area}) ${part1}-${part2}`;
  };

  // Input & DialPad handlers
  const handleInputChange = (e) => setRawInput(e.target.value);
  const handleDialPress = (digit) => {
    setRawInput((prev) => (prev + digit).slice(0, 14));
    setErrorMessage("");
  };
  const handleDelete = () => setRawInput((prev) => prev.slice(0, -1));
  const handleClear = () => {
    setRawInput("");
    setErrorMessage("");
    setStatusMessage("");
  };

  // --- Single toggle button ---
  const handleCall = async () => {
    if (!device) return;

    // If there’s an active call → hang up
    if (callInProgress && activeCall.current) {
      activeCall.current.disconnect();
      setCallInProgress(false);
      setStatusMessage("Call Ended");
      activeCall.current = null;
      return;
    }

    // Otherwise, start a new call
    const digits = rawInput.replace(/\D/g, "").slice(-10);
    setRawInput(formatNumber(digits));

    if (digits.length !== 10) {
      setErrorMessage("Invalid Number");
      return;
    }

    const numberToCall = "+1" + digits;
    setStatusMessage("Calling...");
    setErrorMessage("");

    try {
      const newCall = await device.connect({ params: { To: numberToCall } });
      activeCall.current = newCall;
      setCallInProgress(true);

      // Event listeners for this call
      newCall.on("accept", () => setStatusMessage("Call Connected"));
      newCall.on("disconnect", () => {
        setCallInProgress(false);
        setStatusMessage("Call Ended");
        activeCall.current = null;
      });
      newCall.on("cancel", () => {
        setCallInProgress(false);
        setStatusMessage("Call Cancelled");
        activeCall.current = null;
      });
      newCall.on("failed", () => {
        setCallInProgress(false);
        setStatusMessage("Call Failed");
        activeCall.current = null;
      });
    } catch (err) {
      console.error("Call failed:", err);
      setErrorMessage("Invalid Number or Call Failed");
      setCallInProgress(false);
      setStatusMessage("");
      activeCall.current = null;
    }
  };

  const isCallDisabled = !device || rawInput.trim().length === 0;

  return (
    <div className="App flex flex-col justify-center items-center h-screen my-8">
      <input
        type="text"
        value={rawInput}
        placeholder="Enter number"
        className="mb-2 px-4 py-2 w-56 text-center border rounded text-lg"
        onChange={handleInputChange}
      />
      {statusMessage && (
        <p className="text-green-600 text-sm mt-1">{statusMessage}</p>
      )}
      {errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}

      <DialPad onPress={handleDialPress} onDelete={handleDelete} />

      <button
        onClick={handleClear}
        className="mb-4 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
      >
        Clear
      </button>

      <div className="flex space-x-2">
        <button
          onClick={handleCall}
          disabled={isCallDisabled}
          className={`mr-2 px-4 py-4 rounded-full transition ${
            callInProgress ? "bg-red-500" : "bg-green-400 hover:bg-green-500"
          }`}
        >
          <FaPhoneAlt
            size={25}
            color="white"
            className={callInProgress ? "rotate-135" : ""}
          />
        </button>
      </div>
    </div>
  );
};

export default TwiloDialler;
