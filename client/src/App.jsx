import { useEffect, useState } from "react";
import { Device } from "@twilio/voice-sdk";

function App() {
  const [device, setDevice] = useState(null);
  const [callInProgress, setCallInProgress] = useState(false);

  const setupDevice = (device) => {
    device.on("ready", () => console.log("Device ready"));
    device.on("error", (err) => console.error(err));
  };

  useEffect(() => {
    fetch("https://twilio-app-backend.onrender.com/token")
      .then((res) => res.json())
      .then((data) => {
        const newDevice = new Device(data.token, { debug: true });
        setupDevice(newDevice);
        setDevice(newDevice);
      })
      .catch((err) => console.error(err));
  }, []);

  const makeCall = async () => {
    if (!device) {
      console.log("Device not ready yet!");
      return;
    }

    try {
      setCallInProgress(true); // Set immediately when starting outgoing call
      const connection = await device.connect({
        params: { To: "+13072077080" },
      });

      // Listen for the disconnect of this connection
      connection.on("stateChanged", (state) => {
        if (state === "closed") {
          setCallInProgress(false);
        }
      });
    } catch (err) {
      console.error("Call failed:", err);
      setCallInProgress(false);
    }
  };

  const hangUpCall = () => {
    if (device) {
      device.disconnectAll();
      setCallInProgress(false);
    }
  };

  return (
    <div className="App">
      <h1>Twilio Voice Client</h1>
      <button
        onClick={makeCall}
        disabled={!device || callInProgress}
        style={{ marginRight: "10px" }}
      >
        Make a Call
      </button>
      <button onClick={hangUpCall} disabled={!device || !callInProgress}>
        Hang Up
      </button>
    </div>
  );
}

export default App;
