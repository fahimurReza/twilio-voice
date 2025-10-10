export const timeFormatter = (seconds) => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};

export const currentTime = () => {
  return new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const currentDate = () => {
  return new Date().toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  });
};
