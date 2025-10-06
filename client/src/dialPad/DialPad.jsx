import React, { useState } from "react";

const DialPad = ({ onPress }) => {
  const [longPressTimer, setLongPressTimer] = useState(null);
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const buttons = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];

  const handlePressStart = (btn) => {
    if (btn === "0") {
      setLongPressTriggered(false);
      const timer = setTimeout(() => {
        onPress("+"); // Long press triggers "+"
        setLongPressTriggered(true);
      }, 500); // Long press threshold
      setLongPressTimer(timer);
    }
  };

  const handlePressEnd = (btn) => {
    if (btn === "0") {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
      if (!longPressTriggered) {
        onPress("0"); // Normal press triggers "0"
      }
    }
  };

  const handleClick = (btn) => {
    if (btn !== "0") {
      onPress(btn);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-6 my-8">
      {buttons.map((btn) => (
        <button
          key={btn}
          onMouseDown={() => handlePressStart(btn)}
          onMouseUp={() => handlePressEnd(btn)}
          onTouchStart={() => handlePressStart(btn)}
          onTouchEnd={() => handlePressEnd(btn)}
          onClick={() => handleClick(btn)}
          className="px-4 py-4 bg-gray-200 rounded text-lg hover:bg-gray-300"
        >
          {btn}
        </button>
      ))}
    </div>
  );
};

export default DialPad;
