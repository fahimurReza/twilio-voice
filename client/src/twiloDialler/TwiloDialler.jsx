import React, { useEffect, useState, useRef } from "react";
import { Device } from "@twilio/voice-sdk";
import DialPad from "../dialPad/DialPad";

const TwiloDialler = () => {
  const [device, setDevice] = useState(null);
  const [callInProgress, setCallInProgress] = useState(false);
  const [dialedNumber, setDialedNumber] = useState(""); // only digits
  const [errorMessage, setErrorMessage] = useState("");
  const inputRef = useRef(null);

  // Format number for display as (XXX) XXX-XXXX
  const formatNumber = (num) => {
    const digits = num.replace(/\D/g, "");
    if (!digits) return "";
    const area = digits.slice(0, 3);
    const part1 = digits.slice(3, 6);
    const part2 = digits.slice(6, 10);

    if (digits.length <= 3) return `(${area}`;
    if (digits.length <= 6) return `(${area}) ${part1}`;
    return `(${area}) ${part1}-${part2}`;
  };

  // Setup Twilio Device
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

  // Make Call
  const makeCall = async () => {
    if (!device) return;

    // Prepend +1 for Twilio
    let numberToCall = "+1" + dialedNumber;

    // Validate 11-digit E.164 number
    const isValidNumber = /^\+1\d{10}$/.test(numberToCall);
    if (!isValidNumber) {
      setErrorMessage("Invalid Number");
      setCallInProgress(false);
      return;
    }

    try {
      setErrorMessage("");
      setCallInProgress(true);

      const connection = await device.connect({ params: { To: numberToCall } });

      // Handle remote hangup or disconnect
      connection.on("disconnect", () => setCallInProgress(false));
      connection.on("cancel", () => setCallInProgress(false));
      connection.on("stateChanged", (state) => {
        if (state === "closed") setCallInProgress(false);
      });
    } catch (err) {
      console.error("Call failed:", err);
      setErrorMessage("Invalid Number or Call Failed");
      setCallInProgress(false);
    }
  };

  // Hang Up
  const hangUpCall = () => {
    if (device) {
      device.disconnectAll();
      setCallInProgress(false);
    }
  };

  // DialPad handlers
  const handleDialPress = (digit) => {
    if (dialedNumber.length >= 10) return; // max 10 digits for US
    setErrorMessage("");
    setDialedNumber((prev) => prev + digit);
  };

  const handleDelete = () => {
    setErrorMessage("");
    setDialedNumber((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setDialedNumber("");
    setErrorMessage("");
  };

  // Keep cursor at end
  const formattedNumber = formatNumber(dialedNumber);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.selectionStart = inputRef.current.selectionEnd =
        inputRef.current.value.length;
    }
  }, [formattedNumber]);

  return (
    <div className="App flex flex-col justify-center items-center h-screen">
      <h1 className="mb-4 text-2xl font-bold">Twilio Voice Client</h1>

      {/* Number Display */}
      <input
        type="text"
        ref={inputRef}
        value={formattedNumber}
        placeholder="Enter number"
        readOnly
        className="mb-2 px-4 py-2 w-56 text-center border rounded text-lg"
      />

      {/* Error Message */}
      {errorMessage && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}

      {/* DialPad */}
      <DialPad onPress={handleDialPress} onDelete={handleDelete} />

      {/* Clear */}
      <button
        onClick={handleClear}
        className="mb-4 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
      >
        Clear
      </button>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={makeCall}
          disabled={!device || callInProgress || dialedNumber.length !== 10}
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
