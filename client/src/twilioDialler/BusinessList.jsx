import { useSelector, useDispatch } from "react-redux";
import { removeBusiness } from "../store/store";
import BusinessCard from "./BusinessCard";

function BusinessList() {
  const businesses = useSelector((state) => state.calls.businesses);
  const dispatch = useDispatch();

  return (
    <div className="mt-7 w-full flex flex-col">
      <div className="p-1 pl-4 bg-gradient-to-b from-blue-300 to-blue-50 font-semibold">
        Existing Business
      </div>
      <div className="overflow-y-auto h-[258px]">
        {businesses.length > 0 ? (
          [...businesses]
            .reverse()
            .map((business, index) => (
              <BusinessCard
                key={index}
                index={index}
                name={business.name}
                number={business.number}
                onDelete={() =>
                  dispatch(removeBusiness(businesses.length - 1 - index))
                }
              />
            ))
        ) : (
          <p className="text-gray-500 px-4 py-4">No businesses added yet</p>
        )}
      </div>
    </div>
  );
}

export default BusinessList;
