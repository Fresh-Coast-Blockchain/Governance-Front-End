import React from "react";
import holder from "../../images/holder.png";
import creatorImage from "../../images/creatorImage.png";
import { Link } from "react-router-dom";
import { ExternalLink } from "react-external-link";

function SecondFrame() {
  return (
    <div className="bg-bgGray">
      <div className="h-auto px-5 md:px-16 py-6 md:py-16">
        <div>
          <h3 className=" font-bold text-2xl mt-2 leading-normal text-center">
            <ExternalLink href="http://freshcoastblockchain.com">
              <span>Freshcoastblockchain.com</span>
            </ExternalLink>
          </h3>

          <p className="mt-6 font-normal text-xl text-justify sm:text-center mb-6">
            Fresh coast blockchain is disrupting blockchain governance. We
            provide real-time creation of audited, certified, tested, and
            upgradable governance contracts.
          </p>
        </div>
        <div className="grid grid-cols-2 justify-center gap-6 ">
          <div className="h-auto min-h-[300px] pb-4 col-span-2 mb-4  sm:col-span-1 bg-bgBlue pt-6">
            <h4 className="text-center text-2xl font-bold leading-normal mb-6 ">
              PHASE ONE
            </h4>
            <p className="font-normal text-justify px-6 text-xl ">
              Coin holder - Ability to connect wallet and vote on several
              proposals. Governance Creator - Ability to connect wallet, create
              proposals and vote on proposals.
            </p>
          </div>
          <div className="h-auto min-h-[300px] pb-4 col-span-2 mb-4 sm:col-span-1 bg-bgBlue pt-6">
            <h4 className="text-center text-2xl font-bold leading-normal mb-6 ">
              PHASE TWO
            </h4>
            <p className="font-normal text-justify px-6 text-xl ">
              Coin holder - Ability to connect wallet and vote on several
              proposals. Governance Creator - Ability to connect wallet, create
              proposals and vote on proposals.
            </p>
          </div>
        </div>
      </div>
      <div className="h-auto bg-bgGray grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-5 md:px-16 py-6 md:py-16">
        <div>
          <h3 className=" font-bold text-center md:text-left text-3xl mt-20 mb-6">
            Create a contract, make a proposal or vote
          </h3>

          {/*<p className="mt-6 font-normal text-xl">
            Create proposals and vote on several proposals using our governance
            coin or your own wallet coin.
          </p>*/}
        </div>
        <div
          className="h-[337px] bg-no-repeat border-2 bg-right-bottom  relative"
          style={{ backgroundImage: `url(${creatorImage})` }}
        >
          <span
            className="block absolute -inset-1 bg-bgBlue opacity-30"
            aria-hidden="true"
          ></span>

          <div className="w-full h-full pt-16 relative ">
            <h4 className="text-center text-2xl font-bold leading-normal mb-6 ">
              Workbench
            </h4>
            <p className="font-normal text-center sm:text-justify px-6 text-xl ">
              Use the workbench to create audited, certified and tested
              governance contracts realtime.
            </p>
          </div>
        </div>
        <div
          className="h-[337px]  bg-no-repeat border-2 bg-right-bottom relative"
          style={{ backgroundImage: `url(${holder})` }}
        >
          <span
            className="block absolute -inset-1 bg-bgBlue opacity-30"
            aria-hidden="true"
          ></span>
          <div className="w-full h-full pt-16 relative">
            <h4 className="text-center text-2xl font-bold leading-normal  mb-6">
              Voter
            </h4>
            <p className="font-normal text-center sm:text-justify px-6 text-xl">
              Connect your wallet to see proposals waiting for your vote.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SecondFrame;
