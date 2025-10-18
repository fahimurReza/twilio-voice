import { useCallback } from "react";
import { setCallInput, addCallToHistory } from "../store/store";
import {
  formatDuration,
  currentTime,
  currentDate,
  formatNumber,
} from "../utils";

export function useHandleOutgoingCall({
  device,
  fromNumber,
  inputValue,
  callInProgress,
  setCallInProgress,
  setErrorMessage,
  setStatusMessage,
  setCallDuration,
  dispatch,
  activeCall,
  callTimerRef,
  twilioNumbers,
  setIsSelectError,
  callDuration,
  startTimeRef,
}) {
  const handleOutgoingCall = useCallback(async () => {
    if (!fromNumber) {
      setIsSelectError(true);
      setErrorMessage("Please Select a Business");
      return;
    }
    if (!device) {
      setErrorMessage("Please Connect the Server");
      return;
    }
    if (!inputValue) {
      setErrorMessage("Please Enter a Number");
      return;
    }
    if (inputValue.length < 14) {
      setErrorMessage("Invalid Number");
      return;
    }
    if (callInProgress && activeCall.current) {
      activeCall.current.disconnect();
      setCallInProgress(false);
      setStatusMessage("Call Ended");
      activeCall.current = null;
      startTimeRef.current = null;
      return;
    }

    const digits = inputValue.replace(/\D/g, "");

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
        startTimeRef.current = Date.now();
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
        const duration = startTimeRef.current
          ? Math.floor((Date.now() - startTimeRef.current) / 1000)
          : 0;
        dispatch(
          addCallToHistory({
            phoneNumber: formatNumber(digits),
            business:
              twilioNumbers.find((bus) => bus.value === fromNumber)?.label ||
              "",
            type: "outgoing",
            status: "",
            time: currentTime(),
            date: currentDate(),
            duration: formatDuration(duration),
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
  }, [
    device,
    fromNumber,
    inputValue,
    callInProgress,
    setCallInProgress,
    setErrorMessage,
    setStatusMessage,
    setCallDuration,
    dispatch,
    activeCall,
    callTimerRef,
    twilioNumbers,
    setIsSelectError,
    callDuration,
  ]);

  return { handleOutgoingCall };
}
