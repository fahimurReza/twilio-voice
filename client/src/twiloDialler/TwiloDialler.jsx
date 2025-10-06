import React, { useEffect, useState, useRef } from "react";
import { Device } from "@twilio/voice-sdk";
import DialPad from "../dialPad/DialPad";

const TwiloDialler = () => {
  const [device, setDevice] = useState(null);
  const [callInProgress, setCallInProgress] = useState(false);
  const [dialedNumber, setDialedNumber] = useState(""); // only digits
  const [formattedNumber, setFormattedNumber] = useState(""); // display formatted
  const [errorMessage, setErrorMessage] = useState("");

  // Format digits as (XXX) XXX-XXXX
  const formatNumber = (digits) => {
    if (!digits) return ""; // return empty string if no digits typed
    const area = digits.slice(0, 3);
    const part1 = digits.slice(3, 6);
    const part2 = digits.slice(6, 10);

    if (digits.length <= 3) return `(${area}`;
    if (digits.length <= 6) return `(${area}) ${part1}`;
    return `(${area}) ${part1}-${part2}`;
  };
  // Setup Twilio Device
  useEffect(() => {
    fetch("https://twilio-voice-backend-f5sm.onrender.com/token")
      .then((res) => res.json())
      .then((data) => {
        const newDevice = new Device(data.token, { debug: true });
        newDevice.on("ready", () => console.log("Device ready"));
        newDevice.on("error", (err) => console.error(err));
        setDevice(newDevice);
      })
      .catch((err) => console.error(err));
  }, []);

  // Update formatted number whenever dialedNumber changes
  useEffect(() => {
    setFormattedNumber(formatNumber(dialedNumber));
  }, [dialedNumber]);

  const handleInputChange = (e) => {
    const cursorPos = e.target.selectionStart;
    let digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setDialedNumber(digits);
  };

  const makeCall = async () => {
    if (!device) return;

    const numberToCall = "+1" + dialedNumber;
    if (!/^\+1\d{10}$/.test(numberToCall)) {
      setErrorMessage("Invalid Number");
      setCallInProgress(false);
      return;
    }

    try {
      setErrorMessage("");
      setCallInProgress(true);
      // makin the call
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

  const hangUpCall = () => {
    if (device) {
      device.disconnectAll();
      setCallInProgress(false);
    }
  };

  const handleDialPress = (digit) => {
    if (dialedNumber.length < 10) setDialedNumber(dialedNumber + digit);
    setErrorMessage("");
  };

  const handleDelete = () => setDialedNumber(dialedNumber.slice(0, -1));
  const handleClear = () => setDialedNumber("");

  return (
    <div className="App flex flex-col justify-center items-center h-screen">
      <h1 className="mb-4 text-2xl font-bold">Twilio Voice Client</h1>

      <input
        type="text"
        value={formattedNumber}
        placeholder="Enter number"
        className="mb-2 px-4 py-2 w-56 text-center border rounded text-lg"
        onChange={handleInputChange}
      />

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
