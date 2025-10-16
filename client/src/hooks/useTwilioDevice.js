import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { addCallToHistory } from "../store/store";
import {
  formatIncomingNumber,
  currentTime,
  currentDate,
  formatDuration,
} from "../utils";
import { Device } from "@twilio/voice-sdk";

export function useTwilioDevice(
  fromNumber,
  setShowIncomingCall,
  setIncomingPhoneNumber,
  setIncomingTwilioNumber,
  setIncomingConnection,
  businesses,
  startTimeRef
) {
  const [device, setDevice] = useState(null);
  const [accepted, setAccepted] = useState(false);

  const acceptedRef = useRef(false);
  const businessesRef = useRef(businesses);
  const loggedCallSids = useRef(new Set());

  const dispatch = useDispatch();

  useEffect(() => {
    businessesRef.current = businesses;
  }, [businesses]);

  useEffect(() => {
    acceptedRef.current = accepted;
  }, [accepted]);

  useEffect(() => {
    let newDevice;

    const setupDevice = async () => {
      try {
        const res = await fetch(
          `https://twilio-voice-backend-f5sm.onrender.com/token?from=${fromNumber}`
        );
        const data = await res.json();

        newDevice = new Device(data.token, {
          debug: true,
          codecPreferences: ["opus", "pcmu"],
        });

        newDevice.on("registered", () => {
          console.log("✅ Twilio Device registered");
        });

        newDevice.on("error", (err) => {
          console.error("Twilio Device error:", err);
        });

        newDevice.on("incoming", (call) => {
          const callSid =
            call.parameters?.CallSid || call.customParameters?.get("CallSid");

          if (loggedCallSids.current.has(callSid)) {
            return;
          }
          loggedCallSids.current.add(callSid);
          setShowIncomingCall(true);
          const caller = formatIncomingNumber(
            call.customParameters.get("callerNumber")
          );
          const called = formatIncomingNumber(
            call.customParameters.get("calledNumber")
          );
          setIncomingPhoneNumber(caller);
          setIncomingTwilioNumber(called);
          setIncomingConnection(call);

          const logCall = (status) => {
            if (loggedCallSids.current.has(callSid + status)) return;
            loggedCallSids.current.add(callSid + status);

            const business = businessesRef.current.find(
              (bus) => bus.number === called
            );
            const duration =
              startTimeRef.current && status === "answered"
                ? Math.floor((Date.now() - startTimeRef.current) / 1000)
                : 0;

            dispatch(
              addCallToHistory({
                phoneNumber: caller,
                business: business?.name || "Unknown",
                type: "incoming",
                status,
                time: currentTime(),
                date: currentDate(),
                duration: formatDuration(duration),
              })
            );
          };

          call.on("accept", () => {
            startTimeRef.current = Date.now();
            setAccepted(true);
          });

          call.on("cancel", () => {
            if (!acceptedRef.current && call.status() !== "open") {
              logCall("missed");
              setShowIncomingCall(false);
              setIncomingPhoneNumber("");
              setIncomingTwilioNumber("");
              setIncomingConnection(null);
            }
          });

          call.on("disconnect", () => {
            logCall(acceptedRef.current ? "answered" : "missed");
            setShowIncomingCall(false);
            setIncomingPhoneNumber("");
            setIncomingTwilioNumber("");
            setIncomingConnection(null);
            setAccepted(false);
            startTimeRef.current = null;
          });

          call.on("reject", () => {
            logCall("rejected");
            setShowIncomingCall(false);
            setIncomingPhoneNumber("");
            setIncomingTwilioNumber("");
            setIncomingConnection(null);
            setAccepted(false);
            startTimeRef.current = null;
          });

          call.on("error", (err) => {
            console.error("Call error:", callSid, err);
          });
        });

        await newDevice.register();
        setDevice(newDevice);
      } catch (err) {
        console.error("Device setup error:", err);
      }
    };

    setupDevice();

    return () => {
      if (newDevice) {
        newDevice.removeAllListeners();
      }
    };
  }, [fromNumber]);

  return { device, setAccepted, accepted };
}
