import React, { useState, useEffect } from "react";

const DialPad = ({ onPress, onDelete }) => {
  const [longPressTimer, setLongPressTimer] = useState(null);
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const buttons = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];

  // Keyboard input support
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;

      if (buttons.includes(key)) {
        onPress(key);
      } else if (key === "+") {
        onPress("+");
      } else if (key === "Backspace") {
        onDelete(); // call delete function for backspace
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onPress, onDelete, buttons]);

  const handlePressStart = (btn) => {
    if (btn === "0") {
      setLongPressTriggered(false);
      const timer = setTimeout(() => {
        onPress("+"); // Long press triggers "+"
        setLongPressTriggered(true);
      }, 500);
      setLongPressTimer(timer);
    }
  };

  const handlePressEnd = (btn) => {
    if (btn === "0") {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
      if (!longPressTriggered) {
        onPress("0");
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
