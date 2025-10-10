export const customStyles = (isSelectError) => ({
  control: (provided, state) => ({
    ...provided,
    width: "100%", // full width
    backgroundColor: isSelectError
      ? "#fef2f2" // red-50
      : state.hasValue
      ? "#eff6ff" // blue-50
      : "white",
    borderColor: isSelectError
      ? "#f87171" //red-400
      : state.hasValue
      ? "#60a5fa" // blue-400
      : state.isFocused
      ? "#3b82f6" // blue-600
      : "#bfdbfe", // blue-300
    boxShadow: "none",
    "&:hover": { borderColor: "#3b82f6" },
    borderRadius: "0.25rem", // rounded
    minHeight: "44px",
    fontSize: "1.1rem", // text-base
    fontWeight: "400",
    color: "#6b7280", // gray-500
    transition: "border-color 0.2s ease",
    minHeight: "30px",
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#6b7280", // gray-500
    textAlign: "center",
    fontSize: "1.1rem",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#6b7280", // gray-500
    textAlign: "center",
    fontSize: "1.1rem",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "0.25rem",
    marginTop: "9px",
    zIndex: 20,
    width: "100%",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#eff6ff" : "white", // blue-50 hover
    color: "#6b7280", // gray-500
    textAlign: "center",
    cursor: "pointer",
    fontSize: "1rem",
    padding: "10px 0",
  }),
  // CHANGE: Add styles for down arrow
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: isSelectError ? "#ef4444" : state.hasValue ? "#3b82f6" : "#60a5fa",
  }),
  // CHANGE: Add styles for divider
  indicatorSeparator: (provided, state) => ({
    ...provided,
    backgroundColor: isSelectError
      ? "#ef4444"
      : state.hasValue
      ? "#3b82f6"
      : "#60a5fa",
  }),
});
