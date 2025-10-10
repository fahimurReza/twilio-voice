import { useSelector } from "react-redux";
import Header from "./Header";
import HistoryCard from "./HistoryCard";

function CallHistory() {
  const callHistory = useSelector((state) => state.calls.callHistory);
  return (
    <div className="w-1/2 flex flex-col">
      <Header />
      <div className="h-max-[520px] overflow-y-auto">
        {callHistory.map((call, index) => (
          <HistoryCard key={index} call={call} index={index} />
        ))}
      </div>
    </div>
  );
}

export default CallHistory;
