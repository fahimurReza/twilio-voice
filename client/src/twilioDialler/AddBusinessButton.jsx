import { MdAddCircle } from "react-icons/md";

function AddBusinessButton({ setAddBusinessOn }) {
  return (
    <div
      onClick={() => setAddBusinessOn(true)}
      className="flex items-center h-[40px] cursor-pointer ml-4"
    >
      <MdAddCircle size={22} color="#60a5fa" />
    </div>
  );
}

export default AddBusinessButton;
