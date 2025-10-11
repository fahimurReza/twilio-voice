import { MdAddCircle } from "react-icons/md";

function AddBusinessButton({ setAddBusinessOn }) {
  return (
    <div
      onClick={() => setAddBusinessOn(true)}
      className="flex items-center h-[40px] cursor-pointer ml-4"
    >
      <MdAddCircle size={24} color="#3b82f6" />
    </div>
  );
}

export default AddBusinessButton;
