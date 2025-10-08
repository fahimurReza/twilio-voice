import React, { useEffect, useState, useRef } from "react";
import { Device } from "@twilio/voice-sdk";
import Select from "react-select";
import DialPad from "../dialPad/DialPad";
import { FaPhoneAlt } from "react-icons/fa";
import { FaBackspace } from "react-icons/fa";

import { customStyles } from "../style/reactSelectStyles";

const TwilioDialler = () => {
  const [device, setDevice] = useState(null);
  const [callInProgress, setCallInProgress] = useState(false);
  const [rawInput, setRawInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [fromNumber, setFromNumber] = useState("");

  const twilioNumbers = [
    { label: "Asheboro Tree", value: "+13365230067" },
    { label: "Plano Concrete", value: "+14694094540" },
    { label: "Texarkana Tree", value: "+18706002037" },
  ];

  // Store active Call instance
  const activeCall = useRef(null);
  const clearIntervalRef = useRef(null);

  // Setup Twilio Device
  useEffect(() => {
    if (!fromNumber) return;
    fetch(
      `https://twilio-voice-backend-f5sm.onrender.com/token?from=${fromNumber}`
    )
      .then((res) => res.json())
      .then((data) => {
        const newDevice = new Device(data.token, { debug: true });
        newDevice.on("ready", () => console.log("Device ready"));
        newDevice.on("error", (err) => console.error("Device error:", err));
        setDevice(newDevice);
      })
      .catch((err) => console.error(err));
  }, [fromNumber]);

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
  const handleClearPressStart = () => {
    clearIntervalRef.current = setInterval(() => {
      setRawInput((prev) => prev.slice(0, -1));
    }, 150); // 150ms between deletions
  };
  const handleClearPressEnd = () => {
    clearInterval(clearIntervalRef.current);
    clearIntervalRef.current = null;
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

    const numberToCall = "+1" + digits;
    setStatusMessage("Calling...");
    setErrorMessage("");

    try {
      const newCall = await device.connect({
        params: { To: numberToCall, From: fromNumber },
      });
      activeCall.current = newCall;
      setCallInProgress(true);

      // Event listeners for this call
      newCall.on("accept", () => setStatusMessage("Call Connected"));
      newCall.on("disconnect", () => {
        setCallInProgress(false);
        setStatusMessage("Call Ended");
        setTimeout(() => {
          setStatusMessage("");
        }, 3000);
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
    <div className="flex justify-center items-center mt-6">
      <div
        className="flex flex-col justify-center items-center rounded-xl shadow-2xl 
        px-6 pt-7 pb-8 w-80 bg-white"
      >
        <div className="w-full mb-2">
          <Select
            value={twilioNumbers.find((bus) => bus.value === fromNumber)}
            onChange={(selected) =>
              setFromNumber(selected ? selected.value : "")
            }
            options={twilioNumbers}
            placeholder="Select Business"
            styles={customStyles}
            isSearchable={false}
          />
        </div>

        <input
          type="text"
          value={rawInput}
          onChange={handleInputChange}
          placeholder="Enter number"
          className="w-full mb-2 px-4 py-2 text-center border border-gray-300 
          focus:outline-none focus:border-gray-400 hover:border-gray-400 rounded text-lg"
        />

        <div className="h-1 flex items-center justify-center pt-4">
          {statusMessage && (
            <p className="text-green-600 text-sm">{statusMessage}</p>
          )}
          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
        </div>

        <DialPad onPress={handleDialPress} onDelete={handleDelete} />

        <div className="relative flex justify-center items-center w-full mt-4">
          {/* Call Button */}
          <button
            onClick={handleCall}
            disabled={isCallDisabled}
            className={`px-4 py-4 rounded-full transition ${
              callInProgress ? "bg-red-500" : "bg-blue-600 hover:bg-blue-800"
            }`}
          >
            <FaPhoneAlt
              size={25}
              color="white"
              className={callInProgress ? "rotate-135" : ""}
            />
          </button>

          {/* Clear Button */}
          <button
            onPointerDown={handleClearPressStart}
            onPointerUp={handleClearPressEnd}
            onPointerLeave={handleClearPressEnd}
            className={`absolute right-8 transition-opacity duration-300 ${
              rawInput
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <FaBackspace size={30} color="gray" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwilioDialler;
