import Dialer from "./Dialer";
import CallHistory from "./CallHistory";

const TwilioDialler = () => {
  return (
    <div className="flex justify-center content-center mt-6 rounded-xl shadow-2xl w-180">
      <CallHistory />
      <div className="w-[1px] bg-gray-100" />
      <Dialer />
    </div>
  );
};

export default TwilioDialler;
