import { useSelector } from "react-redux";
import HistoryCard from "./HistoryCard";
import CustomHeader from "./CustomHeader";

function CallHistory() {
  const callHistory = useSelector((state) => state.calls.callHistory);
  return (
    <div className="w-1/2 flex flex-col">
      <CustomHeader
        headline={"Call History"}
        className="rounded-tl-lg h-[72px]"
      />
      <div className="overflow-y-auto mt-[-10px]">
        {Array.isArray(callHistory) && callHistory.length > 0 ? (
          [...callHistory]
            .reverse()
            .map((call, displayIndex) => (
              <HistoryCard
                key={callHistory.length - 1 - displayIndex}
                call={call}
                index={callHistory.length - 1 - displayIndex}
              />
            ))
        ) : (
          <p className="text-gray-500 px-3 py-2">No calls yet</p>
        )}
      </div>
    </div>
  );
}

export default CallHistory;
