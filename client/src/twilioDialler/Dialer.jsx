import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCall, setCallInput } from "../store/store";
import { Device } from "@twilio/voice-sdk";
import DialPad from "./DialPad";
import AddBusiness from "./AddBusiness";
import NumberInput from "./NumberInput";
import BusinessSelect from "./BusinessSelect";
import ErrorAndStatus from "./ErrorAndStatus";
import MakeCallButton from "./MakeCallButton";
import DeleteButton from "./DeleteButton";
import AddBusinessButton from "./AddBusinessButton";

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
  const [isAddBusinessOn, setAddBusinessOn] = useState(false);

  const twilioNumbers = [
    { label: "Asheboro Tree", value: "+13365230067" },
    { label: "Plano Concrete", value: "+14694094540" },
    { label: "Texarkana Tree", value: "+18706002037" },
  ];

  const dispatch = useDispatch();
  const activeCall = useRef(null);
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
      setAddBusinessOn(false);
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
      setErrorMessage("Please Connect the Server");
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
    <div className="w-1/2">
      {isAddBusinessOn ? (
        <AddBusiness CloseAddBusiness={() => setAddBusinessOn(false)} />
      ) : (
        <div className="flex flex-col justify-center items-center py-7">
          <div className="flex justify-center items-center mb-2">
            <BusinessSelect
              selectValue={selectValue}
              handleSelectChange={handleSelectChange}
              twilioNumbers={twilioNumbers}
              isSelectError={isSelectError}
              setAddBusinessOn={setAddBusinessOn}
            />
            <AddBusinessButton setAddBusinessOn={setAddBusinessOn} />
          </div>
          <NumberInput
            inputValue={rawInput}
            isInputFocused={isInputFocused}
            setIsInputFocused={setIsInputFocused}
            handleInputChange={handleInputChange}
            handleInputEnter={handleInputEnter}
            setOnFocus={() => setIsInputFocused(true)}
            setOnBlur={() => setIsInputFocused(false)}
            inputClassName="focus:outline-none"
          />
          <ErrorAndStatus
            callInProgress={callInProgress}
            callTimerRef={callTimerRef}
            callDuration={callDuration}
            statusMessage={statusMessage}
            errorMessage={errorMessage}
            timeFormatter={timeFormatter}
          />
          <DialPad onPress={handleDialPress} onDelete={handleDelete} />
          <div className="relative flex justify-center items-center w-full mt-4">
            <MakeCallButton
              handleCall={handleCall}
              callInProgress={callInProgress}
            />
            <DeleteButton handleDelete={handleDelete} rawInput={rawInput} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Dialer;
