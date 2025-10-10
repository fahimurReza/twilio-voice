import React from "react";
import { useSelector } from "react-redux";
import HistoryCard from "./HistoryCard";
import Header from "./Header";

function CallHistory() {
  const callHistory = useSelector((state) => state.calls.callHistory);
  return (
    <div className="w-1/2 flex flex-col">
      <Header />
      <div className="max-h-[520px] overflow-y-auto">
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
