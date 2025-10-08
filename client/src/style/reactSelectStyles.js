export const customStyles = {
  control: (provided, state) => ({
    ...provided,
    width: "100%", // full width
    backgroundColor: "#f1f6fd",
    borderColor: state.isFocused ? "#9ca3af" : "#d1d5db", // neutral gray-400 / gray-300
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
    backgroundColor: state.isFocused ? "#f4f4f5" : "white", // gray-100 hover
    color: "#6b7280", // gray-500
    textAlign: "center",
    cursor: "pointer",
    fontSize: ".9rem",
    padding: "10px 0",
  }),
};
