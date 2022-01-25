import React from "react";
import holder from "../../images/coinholder.png";

function CoinHero() {
  return (
    <div>
      <div className="pt-14 bg-bgBlue h-auto px-5 md:px-16 pb-10 grid grid-cols-4">
        <div className="col-span-4 sm:col-span-2 xl:col-span-2">
          <div className="flex flex-col justify-center h-full ">
            <h1 className="font-bold text-3xl sm:text-5xl lg:text-6xl pb-2  sm:pt-10">
              Vote on Proposals
            </h1>
            <p className="font-normal text-sm sm:text-xl ">
              Make your voice heard. View proposals and vote.
            </p>
          </div>
        </div>
        <div className="hidden sm:block sm:col-span-2 xl:col-span-2 h-[275px] ">
          <img
            src={holder}
            alt="coin holder"
            className="mr-0  h-full m-auto "
          />
        </div>
      </div>
    </div>
  );
}

export default CoinHero;
