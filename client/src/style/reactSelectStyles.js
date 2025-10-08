export const customStyles = (isSelectError) => ({
  control: (provided, state) => ({
    ...provided,
    width: "100%", // full width
    backgroundColor: isSelectError
      ? "#fef2f2" // red-50
      : state.hasValue
      ? "#f0fdf4" // green-50
      : "white",
    borderColor: isSelectError
      ? "#f87171" //red-400
      : state.hasValue
      ? "#4ade80" // green-400
      : state.isFocused
      ? "#9ca3af" // gray-400
      : "#d1d5db", // gray-300
    boxShadow: "none",
    "&:hover": { borderColor: "#a1a1aa" },
    borderRadius: "0.25rem", // rounded
    minHeight: "44px",
    fontSize: "1.1rem", // text-base
    fontWeight: "400",
    color: "#6b7280", // gray-500
    transition: "border-color 0.2s ease",
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
    backgroundColor: state.isFocused ? "#f3f4f6" : "white", // gray-100 hover
    color: "#6b7280", // gray-500
    textAlign: "center",
    cursor: "pointer",
    fontSize: ".9rem",
    padding: "10px 0",
  }),
});
