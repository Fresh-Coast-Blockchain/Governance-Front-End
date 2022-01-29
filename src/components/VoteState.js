import React from "react";

function VoteState({ status }) {
  //display components based on proposal status
  if (status === 0) {
    return (
      <div className="bg-gray-300 font-normal w-[100px]  flex items-center justify-center  text-center text-xs text-gray-500   sm:ml-2   rounded-full ">
        <span>Upcoming</span>
      </div>
    );
  } else if (status === 1) {
    return (
      <div className="bg-bgGray font-normal w-[100px] flex items-center justify-center text-center text-xs text-primaryBtn   sm:ml-2   rounded-full ">
        Active
      </div>
    );
  } else if (status > 1) {
    return (
      <div className="bg-greenShade font-normal w-[100px] flex items-center justify-center text-center text-xs text-yesPoint  sm:ml-2   rounded-full ">
        Finished
      </div>
    );
  }
}

export default VoteState;
