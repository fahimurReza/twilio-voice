import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCall, setCallInput } from "../store/store";
import { Device } from "@twilio/voice-sdk";
import Select from "react-select";
import DialPad from "./DialPad";
import { FaPhoneAlt } from "react-icons/fa";
import { FaBackspace } from "react-icons/fa";
import { customStyles } from "../style/reactSelectStyles";
import {
  timeFormatter,
  currentTime,
  currentDate,
  formatNumber,
} from "../utils";

function Dialer() {
  const [device, setDevice] = useState(null);
  const [callInProgress, setCallInProgress] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [callDuration, setCallDuration] = useState(0);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isSelectError, setIsSelectError] = useState(false);

  const twilioNumbers = [
    { label: "Asheboro Tree", value: "+13365230067" },
    { label: "Plano Concrete", value: "+14694094540" },
    { label: "Texarkana Tree", value: "+18706002037" },
  ];

  const dispatch = useDispatch();
  const activeCall = useRef(null);
  const clearIntervalRef = useRef(null);
  const callTimerRef = useRef(null);

  const {
    rawInput = "",
    fromNumber = "",
    startCall,
  } = useSelector((state) => {
    return state.calls || { rawInput: "", fromNumber: "", startCall: false };
  });

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

  // useEffect to auto-trigger handleCall on startCall flag
  useEffect(() => {
    if (startCall && device && fromNumber && rawInput) {
      setIsSelectError(false);
      handleCall();
      dispatch(
        setCallInput({ phoneNumber: rawInput, fromNumber, startCall: false })
      );
    }
  }, [startCall, device, fromNumber, rawInput, dispatch]);

  // Input & DialPad handlers
  const handleInputChange = (e) => {
    const allDigits = e.target.value.replace(/\D/g, "");
    let phoneDigits = allDigits;
    if (allDigits.length > 10 && allDigits.startsWith("1")) {
      phoneDigits = allDigits.slice(1, 11);
    } else {
      phoneDigits = allDigits.slice(0, 10);
    }
    dispatch(
      setCallInput({
        phoneNumber: formatNumber(phoneDigits),
        fromNumber,
        startCall: false,
      })
    );
  };

  const handleInputEnter = (e) => {
    e.key === "Enter" && handleCall();
  };

  const handleDialPress = (digit) => {
    const currentDigits = rawInput.replace(/\D/g, "");
    const newDigits = (currentDigits + digit).slice(0, 10);
    dispatch(
      setCallInput({
        phoneNumber: formatNumber(newDigits),
        fromNumber,
        startCall: false,
      })
    );
    setErrorMessage("");
  };

  const handleDelete = () => {
    const currentDigits = rawInput.replace(/\D/g, "");
    const newDigits = currentDigits.slice(0, -1);
    dispatch(
      setCallInput({
        phoneNumber: formatNumber(newDigits),
        fromNumber,
        startCall: false,
      })
    );
  };

  const handleSelectChange = (selected) => {
    dispatch(
      setCallInput({
        phoneNumber: rawInput,
        fromNumber: selected ? selected.value : "",
        startCall: false,
      })
    );
    setIsSelectError(false);
    setErrorMessage("");
  };

  const selectValue = () => {
    return fromNumber
      ? twilioNumbers.find((bus) => bus.value === fromNumber)
      : null;
  };

  const handleCall = async () => {
    if (!fromNumber) {
      setIsSelectError(true);
      setErrorMessage("Please Select a Business");
      return;
    }
    if (!device) {
      setErrorMessage("Connect the Server");
      return;
    }
    if (!rawInput) {
      setErrorMessage("Please Enter a Number");
      return;
    }
    if (rawInput.length < 14) {
      setErrorMessage("Invalid Number");
      return;
    }

    if (callInProgress && activeCall.current) {
      activeCall.current.disconnect();
      setCallInProgress(false);
      setStatusMessage("Call Ended");
      activeCall.current = null;
      return;
    }

    const digits = rawInput.replace(/\D/g, "");
    dispatch(
      setCallInput({
        phoneNumber: formatNumber(digits),
        fromNumber,
        startCall: false,
      })
    );

    const numberToCall = "+1" + digits;
    setStatusMessage("Calling...");
    setErrorMessage("");
    setCallDuration(0);

    try {
      const newCall = await device.connect({
        params: { To: numberToCall, From: fromNumber },
      });
      activeCall.current = newCall;
      setCallInProgress(true);

      newCall.on("accept", () => {
        setStatusMessage("");
        setCallDuration(0);
        callTimerRef.current = setInterval(() => {
          setCallDuration((prev) => prev + 1);
        }, 1000);
      });
      newCall.on("disconnect", () => {
        setCallInProgress(false);
        setStatusMessage("Call Ended");
        dispatch(
          setCallInput({ phoneNumber: "", fromNumber: "", startCall: false })
        );
        if (callTimerRef.current) {
          clearInterval(callTimerRef.current);
          callTimerRef.current = null;
        }
        dispatch(
          addCall({
            phoneNumber: formatNumber(digits),
            business:
              twilioNumbers.find((bus) => bus.value === fromNumber)?.label ||
              "",
            time: currentTime(),
            date: currentDate(),
            duration: timeFormatter(callDuration),
          })
        );
        setTimeout(() => {
          setStatusMessage("");
        }, 4000);
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

  return (
    <div className="flex flex-col justify-center items-center w-1/2 py-7">
      <div id="inputBox" className="w-60">
        <div className="w-full mb-2">
          <Select
            value={selectValue()}
            onChange={(selected) => handleSelectChange(selected)}
            options={twilioNumbers}
            placeholder="Select a Business"
            styles={customStyles(isSelectError)}
            isSearchable={true}
          />
        </div>
        <div className="flex items-center mb-2 rounded focus-within:border-gray-400 hover:border-gray-400">
          <span
            className={`pl-9 pr-1 text-[18px] font-semibold text-gray-700 ${
              rawInput ? "opacity-100 pl-11" : "opacity-0"
            }`}
          >
            +1
          </span>
          <input
            type="text"
            value={rawInput || ""}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            onChange={handleInputChange}
            onKeyDown={(e) => handleInputEnter(e)}
            placeholder={isInputFocused ? "999-999-9999" : "Enter a number"}
            className={`flex-1 pr-4 py-2 text-[18px] font-semibold placeholder:text-lg bg-transparent
            placeholder:font-normal placeholder:text-gray-500 focus:outline-none 
            focus:placeholder:text-[18px] focus:placeholder:text-gray-300`}
          />
        </div>
      </div>

      <div className="h-1 flex items-center justify-center mb-2">
        {callInProgress && callTimerRef.current ? (
          <p className="text-green-600 text-base">
            {timeFormatter(callDuration)}
          </p>
        ) : statusMessage ? (
          <p className="text-green-600 text-base">{statusMessage}</p>
        ) : errorMessage ? (
          <p className="text-red-500 text-base">{errorMessage}</p>
        ) : null}
      </div>

      <DialPad onPress={handleDialPress} onDelete={handleDelete} />

      <div className="relative flex justify-center items-center w-full mt-4">
        <button
          onClick={handleCall}
          className={`px-4 py-4 rounded-full transition ${
            callInProgress ? "bg-red-500" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          <FaPhoneAlt
            size={25}
            color="white"
            className={callInProgress ? "rotate-135" : ""}
          />
        </button>

        <button
          onClick={handleDelete}
          className={`absolute right-16 transition-opacity duration-300 ${
            rawInput
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <FaBackspace size={30} color="gray" />
        </button>
      </div>
    </div>
  );
}

export default Dialer;
