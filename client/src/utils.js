export const formatDuration = (seconds) => {
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

// Format digits as (XXX) XXX-XXXX
export const formatNumber = (digits) => {
  if (!digits) return "";
  const area = digits.slice(0, 3);
  const part1 = digits.slice(3, 6);
  const part2 = digits.slice(6, 10);
  if (digits.length <= 3) return `(${area}`;
  if (digits.length <= 6) return `(${area}) ${part1}`;
  return `(${area}) ${part1}-${part2}`;
};

export const formatIncomingNumber = (input) => {
  if (!input) return "";
  let digits = input.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    digits = digits.slice(1);
  }
  const area = digits.slice(0, 3);
  const part1 = digits.slice(3, 6);
  const part2 = digits.slice(6, 10);
  if (digits.length <= 3) return `(${area}`;
  if (digits.length <= 6) return `(${area}) ${part1}`;
  return `(${area}) ${part1}-${part2}`;
};
