import React, { useState, useEffect } from "react";

const DialPad = ({ onPress, onDelete }) => {
  const [longPressTimer, setLongPressTimer] = useState(null);
  const [longPressTriggered, setLongPressTriggered] = useState(false);

  // Each button with its letters
  const buttons = [
    { digit: "1", letters: "" },
    { digit: "2", letters: "ABC" },
    { digit: "3", letters: "DEF" },
    { digit: "4", letters: "GHI" },
    { digit: "5", letters: "JKL" },
    { digit: "6", letters: "MNO" },
    { digit: "7", letters: "PQRS" },
    { digit: "8", letters: "TUV" },
    { digit: "9", letters: "WXYZ" },
    { digit: "*", letters: "" },
    { digit: "0", letters: "+" },
    { digit: "#", letters: "" },
  ];

  // Keyboard input support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (document.activeElement.tagName === "INPUT") return;
      const key = e.key;

      if (buttons.some((b) => b.digit === key)) {
        onPress(key);
      } else if (key === "+") {
        onPress("+");
      } else if (key === "Backspace") {
        onDelete();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onPress, onDelete, buttons]);

  const handlePressStart = (btn) => {
    if (btn === "0") {
      setLongPressTriggered(false);
      const timer = setTimeout(() => {
        onPress("+");
        setLongPressTriggered(true);
      }, 500);
      setLongPressTimer(timer);
    }
  };

  const handlePressEnd = (btn) => {
    if (btn === "0") {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
      if (!longPressTriggered) onPress("0");
    }
  };

  const handleClick = (btn) => {
    if (btn !== "0") onPress(btn);
  };

  return (
    <div className="grid grid-cols-3 gap-6 mt-8 mb-4">
      {buttons.map(({ digit, letters }) => (
        <button
          key={digit}
          onMouseDown={() => handlePressStart(digit)}
          onMouseUp={() => handlePressEnd(digit)}
          onTouchStart={() => handlePressStart(digit)}
          onTouchEnd={() => handlePressEnd(digit)}
          onClick={() => handleClick(digit)}
          className="w-16 h-16 flex flex-col justify-center items-center bg-gray-200 rounded-full hover:bg-gray-300 transition shadow-sm"
        >
          <span className="text-xl font-semibold leading-none">{digit}</span>
          {letters && (
            <span className="text-[10px] text-gray-600 mt-1 tracking-wider">
              {letters}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default DialPad;
