import { useSelector } from "react-redux";
import Header from "./Header";
import HistoryCard from "./HistoryCard";

function CallHistory() {
  const callHistory = useSelector((state) => state.calls.callHistory);
  return (
    <div className="w-1/2">
      <Header />
      <div className="w-full">
        {callHistory.map((call, index) => (
          <HistoryCard key={index} call={call} />
        ))}
      </div>
    </div>
  );
}

export default CallHistory;
