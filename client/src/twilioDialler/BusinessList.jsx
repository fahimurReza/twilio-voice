import React from "react";
import BusinessCard from "./BusinessCard";

function BusinessList() {
  return (
    <div className="mt-7 w-full flex flex-col">
      <div className="p-1 pl-4 bg-gradient-to-r from-blue-300 to-white font-semibold">
        Existing Business
      </div>
      <div className="overflow-y-auto h-[258px]">
        <BusinessCard />
        <BusinessCard />
        <BusinessCard />
      </div>
    </div>
  );
}

export default BusinessList;
