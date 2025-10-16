import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCallInput } from "../store/store";
import { useTwilioDevice } from "../hooks/useTwilioDevice";
import { useHandleOutgoingCall } from "../hooks/useHandleOutgoingCall";
import DialPad from "./DialPad";
import AddBusiness from "./AddBusiness";
import NumberInput from "./NumberInput";
import BusinessSelect from "./BusinessSelect";
import ErrorAndStatus from "./ErrorAndStatus";
import MakeCallButton from "./MakeCallButton";
import DeleteButton from "./DeleteButton";
import AddBusinessButton from "./AddBusinessButton";
import IncomingWindow from "./IncomingWindow";
import { timeFormatter, formatNumber } from "../utils";

function Dialer() {
  const [device, setDevice] = useState(null);
  const [callInProgress, setCallInProgress] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [callDuration, setCallDuration] = useState(0);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isSelectError, setIsSelectError] = useState(false);
  const [isAddBusinessOn, setAddBusinessOn] = useState(false);
  const [incomingPhoneNumber, setIncomingPhoneNumber] = useState("");
  const [incomingTwilioNumber, setIncomingTwilioNumber] = useState("");
  const [showIncomingCall, setShowIncomingCall] = useState(false);
  const [incomingConnection, setIncomingConnection] = useState(null);

  const dispatch = useDispatch();
  const activeCall = useRef(null);
  const callTimerRef = useRef(null);
  const acceptedRef = useRef(false);

  const {
    inputValue = "",
    fromNumber = "",
    businesses = [],
    startCall,
  } = useSelector((state) => {
    return (
      state.calls || {
        inputValue: "",
        fromNumber: "",
        businesses: [],
        startCall: false,
      }
    );
  });

  const twilioNumbers = businesses.map((business) => ({
    value: business.number,
    label: business.name,
  }));

  // Use the custom Twilio Device setup hook
  const {
    device: twilioDevice,
    setAccepted,
    accepted,
  } = useTwilioDevice(
    fromNumber,
    setShowIncomingCall,
    setIncomingPhoneNumber,
    setIncomingTwilioNumber,
    setIncomingConnection
  );

  useEffect(() => {
    acceptedRef.current = accepted;
    setDevice(twilioDevice);
  }, [accepted, twilioDevice]);

  // Handler for accepting incoming call
  const acceptIncoming = () => {
    if (incomingConnection) {
      acceptedRef.current = true;
      setAccepted(true);
      incomingConnection.accept();
    }
  };

  // Handler for rejecting incoming call
  const rejectIncoming = () => {
    if (incomingConnection) {
      if (acceptedRef.current) {
        incomingConnection.disconnect();
      } else {
        incomingConnection.reject();
      }
      setAccepted(false);
      acceptedRef.current = false;
      setShowIncomingCall(false);
      setIncomingPhoneNumber("");
      setIncomingTwilioNumber("");
      setIncomingConnection(null);
    }
  };

  // useEffect to auto-trigger handleOutgoingCall on startCall flag
  useEffect(() => {
    if (startCall && device && fromNumber && inputValue) {
      setIsSelectError(false);
      setAddBusinessOn(false);
      handleOutgoingCall();
      dispatch(
        setCallInput({ phoneNumber: inputValue, fromNumber, startCall: false })
      );
    }
  }, [startCall, device, fromNumber, inputValue, dispatch]);

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
    e.key === "Enter" && handleOutgoingCall();
  };

  const handleDialPress = (digit) => {
    const currentDigits = inputValue.replace(/\D/g, "");
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
    const currentDigits = inputValue.replace(/\D/g, "");
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
        phoneNumber: inputValue,
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

  // Use the custom Twilio Call hook
  const { handleOutgoingCall } = useHandleOutgoingCall({
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
  });

  return (
    <div className="w-1/2">
      {showIncomingCall ? (
        <IncomingWindow
          incomingPhoneNumber={incomingPhoneNumber}
          incomingTwilioNumber={incomingTwilioNumber}
          acceptIncoming={acceptIncoming}
          rejectIncoming={rejectIncoming}
        />
      ) : isAddBusinessOn ? (
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
            inputValue={inputValue}
            isInputFocused={isInputFocused}
            setIsInputFocused={setIsInputFocused}
            handleInputChange={handleInputChange}
            handleInputEnter={handleInputEnter}
            setOnFocus={() => setIsInputFocused(true)}
            setOnBlur={() => setIsInputFocused(false)}
            inputClassName="focus:outline-none text-[18px] font-semibold "
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
              handleOutgoingCall={handleOutgoingCall}
              callInProgress={callInProgress}
            />
            <DeleteButton handleDelete={handleDelete} inputValue={inputValue} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Dialer;
