import React, { useEffect, useState } from "react";
import { Device } from "@twilio/voice-sdk";
import DialPad from "../dialPad/DialPad";

const TwiloDialler = () => {
  const [device, setDevice] = useState(null);
  const [callInProgress, setCallInProgress] = useState(false);
  const [rawInput, setRawInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

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

  // handle keyboard input
  const handleInputChange = (e) => {
    console.log(e.target.value);
    setRawInput(e.target.value);
  };

  // handle pressing dialpad digits
  const handleDialPress = (digit) => {
    setRawInput((prev) => (prev + digit).slice(0, 14)); // limit input length
    setErrorMessage("");
  };

  const makeCall = async () => {
    if (!device) return;

    // Extract only digits
    const digits = rawInput.replace(/\D/g, "").slice(-10);

    if (digits.length !== 10) {
      setErrorMessage("Invalid Number");
      return;
    }

    const formatted = formatNumber(digits);
    setRawInput(formatted);
    setStatusMessage("Calling...");

    const numberToCall = "+1" + digits;

    try {
      setErrorMessage("");
      setCallInProgress(true);

      const connection = await device.connect({ params: { To: numberToCall } });

      connection.on("disconnect", () => {
        setCallInProgress(false);
        setStatusMessage("Call Ended");
      });

      connection.on("cancel", () => {
        setCallInProgress(false);
        setStatusMessage("Call Cancelled");
      });

      connection.on("stateChanged", (state) => {
        if (state === "closed") {
          setCallInProgress(false);
          setStatusMessage("Call Ended");
        }
      });
    } catch (err) {
      console.error("Call failed:", err);
      setErrorMessage("Invalid Number or Call Failed");
      setCallInProgress(false);
      setStatusMessage("");
    }
  };

  const hangUpCall = () => {
    if (device) {
      device.disconnectAll();
      setCallInProgress(false);
    }
  };

  // delete last digit
  const handleDelete = () => setRawInput((prev) => prev.slice(0, -1));

  // clear input
  const handleClear = () => {
    setRawInput("");
    setErrorMessage("");
    setStatusMessage("");
  };

  return (
    <div className="App flex flex-col justify-center items-center h-screen">
      <h1 className="mb-4 text-2xl font-bold">Twilio Voice Client</h1>
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
          onClick={makeCall}
          disabled={!device || callInProgress || rawInput.trim().length === 0}
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
