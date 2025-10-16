import { useEffect, useState, useRef } from "react";
import { Device } from "@twilio/voice-sdk";

export function useTwilioDevice(
  fromNumber,
  setShowIncomingCall,
  setIncomingPhoneNumber,
  setIncomingTwilioNumber,
  setIncomingConnection
) {
  const [device, setDevice] = useState(null);
  const [accepted, setAccepted] = useState(false);
  const acceptedRef = useRef(false);

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
          console.log("Twilio Device registered and ready for calls");
        });
        newDevice.on("error", (err) => {
          console.error("Twilio Device error:", err);
        });
        newDevice.on("incoming", (call) => {
          setShowIncomingCall(true);
          setIncomingPhoneNumber(call.customParameters.get("callerNumber"));
          setIncomingTwilioNumber(call.customParameters.get("calledNumber"));
          setIncomingConnection(call);
          call.on("accept", () => {
            console.log("Call accepted, status:", call.status());
          });
          call.on("cancel", () => {
            if (!acceptedRef.current && call.status() !== "open") {
              setShowIncomingCall(false);
            }
          });
          call.on("disconnect", () => {
            console.log("Incoming call disconnected, status:", call.status());
            setShowIncomingCall(false);
            setIncomingPhoneNumber("");
            setIncomingTwilioNumber("");
            setIncomingConnection(null);
          });
          call.on("error", (err) => {
            console.error("Call error:", err);
          });
        });
        newDevice.on("unregistered", () => {
          console.log("Twilio Device unregistered");
        });
        await newDevice.register();
        setDevice(newDevice);
      } catch (err) {
        console.error(err);
      }
    };
    setupDevice();
  }, [
    fromNumber,
    setShowIncomingCall,
    setIncomingPhoneNumber,
    setIncomingTwilioNumber,
    setIncomingConnection,
  ]);

  return { device, setAccepted, accepted };
}
