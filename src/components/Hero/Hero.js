import React, { useEffect } from "react";
import homepageHero from "../../images/homepageHero.png";
import { useMoralis } from "react-moralis";
import { useAuthUpdate, useAuth } from "../../contexts/AuthProvider";

function Hero() {
  //get update contexts
  const [connectWallet] = useAuthUpdate();
  //get auth context
  const [AuthState, currentAccount] = useAuth();
  const { isAuthenticated, isWeb3Enabled, enableWeb3 } = useMoralis();

  return (
    <div>
      <div className="grid grid-cols-4 pt-14 pb-10 h-auto px-5 md:px-16  bg-bgBlue ">
        <div className=" col-span-4 sm:col-span-2 ">
          <div className="flex flex-col justify-center h-full ">
            <h2 className=" font-bold text-center sm:text-left  text-3xl sm:text-5xl lg:text-6xl pb-4 xl:leading-normal">
              Access to Unlimited Governance Proposals
            </h2>
            <p className=" text-xl text-justify  sm:text-left sm:text-2xl font-normal">
              Create, view and vote on governance proposals.
            </p>

            <div className=" flex justify-center sm:justify-start">
              {!AuthState && (
                <div
                  onClick={() => {
                    connectWallet();
                  }}
                  className="bg-primaryBtn w-fit text-white mt-6  font-medium leading-loose cursor-pointer rounded-2xl p-2 px-4 tracking-wider"
                >
                  Connect Wallet
                </div>
              )}
            </div>
          </div>
        </div>
        <div className=" hidden sm:block sm:col-span-2 ">
          <img
            className=" h-full w-full"
            src={homepageHero}
            alt="freshconcept"
          />
        </div>
      </div>
    </div>
  );
}

export default Hero;
