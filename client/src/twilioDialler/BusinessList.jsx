import { useSelector, useDispatch } from "react-redux";
import { removeBusinessNumber } from "../store/store";
import BusinessCard from "./BusinessCard";

function BusinessList() {
  const businessNumbers = useSelector((state) => state.calls.businessNumbers);
  const dispatch = useDispatch();

  return (
    <div className="mt-7 w-full flex flex-col">
      <div className="p-1 pl-4 bg-gradient-to-r from-blue-300 to-white font-semibold">
        Existing Business
      </div>
      <div className="overflow-y-auto h-[258px]">
        {businessNumbers.length > 0 ? (
          [...businessNumbers]
            .reverse()
            .map((business, index) => (
              <BusinessCard
                key={index}
                index={index}
                name={business.name}
                number={business.number}
                onDelete={() =>
                  dispatch(
                    removeBusinessNumber(businessNumbers.length - 1 - index)
                  )
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
