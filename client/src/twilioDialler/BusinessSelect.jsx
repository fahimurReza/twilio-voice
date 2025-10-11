import Select from "react-select";
import { customStyles } from "../style/reactSelectStyles";

function BusinessSelect({
  selectValue,
  handleSelectChange,
  twilioNumbers,
  isSelectError,
}) {
  return (
    <div className="flex w-full justify-center">
      <div className="w-58 ml-[38px]">
        <Select
          value={selectValue()}
          onChange={(selected) => handleSelectChange(selected)}
          options={twilioNumbers}
          placeholder="Select a Business"
          styles={customStyles(isSelectError)}
          isSearchable={true}
        />
      </div>
    </div>
  );
}

export default BusinessSelect;
