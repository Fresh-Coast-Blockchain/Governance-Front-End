import React from "react";
import result from "../../images/result.png";

function ResultHero() {
  return (
    <div>
      <div className="pt-14 bg-bgBlue h-auto px-5 md:px-16 pb-10 grid grid-cols-4">
        <div className="col-span-4 sm:col-span-2 xl:col-span-2">
          <div className="flex flex-col justify-center h-full ">
            <h1 className="font-bold text-3xl sm:text-5xl lg:text-6xl pb-2  sm:pt-10">
              Result
            </h1>
            <p className="font-normal text-sm sm:text-xl ">
              View full information and details of every finished proposal for
              several governance contract.
            </p>
          </div>
        </div>
        <div className="hidden sm:block sm:col-span-2 xl:col-span-2 h-[275px] ">
          <img
            src={result}
            alt="coin holder"
            className="mr-0  h-full m-auto "
          />
        </div>
      </div>
    </div>
  );
}

export default ResultHero;
