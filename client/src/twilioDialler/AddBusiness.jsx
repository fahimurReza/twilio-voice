import { MdDialpad } from "react-icons/md";

function AddBusiness({ onClose }) {
  return (
    <div className="flex flex-col items-center relative h-full">
      Add a New Business
      <div
        onClick={onClose}
        className="p-3 w-13 h-13 cursor-pointer z-10 rounded-full bg-blue-300 absolute bottom-1 right-8"
      >
        <MdDialpad size={28} />
      </div>
      <div className="mt-10 flex flex-col items-center">
        Name of the Business
        <input className="border rounded border-blue-300" />
      </div>
    </div>
  );
}

export default AddBusiness;
