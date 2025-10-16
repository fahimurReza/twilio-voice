import React from "react";

function ErrorAndStatus({
  callInProgress,
  callTimerRef,
  callDuration,
  statusMessage,
  errorMessage,
  formatDuration,
}) {
  return (
    <div className="h-1 flex items-center justify-center mb-2">
      {callInProgress && callTimerRef.current ? (
        <p className="text-green-600 text-base">
          {formatDuration(callDuration)}
        </p>
      ) : statusMessage ? (
        <p className="text-green-600 text-base">{statusMessage}</p>
      ) : errorMessage ? (
        <p className="text-red-500 text-base">{errorMessage}</p>
      ) : null}
    </div>
  );
}

export default ErrorAndStatus;
