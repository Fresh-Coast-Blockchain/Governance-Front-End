import React, { useState, useEffect } from "react";
import coin from "../../images/coin.png";
import { useMoralis } from "react-moralis";
import { useAuthUpdate, useAuth } from "../../contexts/AuthProvider";
import ProposalModal from "../Modal/ProposalModal";
import { Link, useParams } from "react-router-dom";
import img from "../../images/img.png";

function HolderHero() {
  const [modalVissible, setModal] = useState(false);
  const [name, setName] = useState("");
  const [votesNumber, setVotesNumber] = useState(0);
  const [proposalsNumber, setProposalsNumber] = useState(0);
  const [caution, setCaution] = useState(false);
  const { address } = useParams();
  const [image, setImage] = useState("");
  const {
    isAuthenticated,
    isWeb3Enabled,
    enableWeb3,
    Moralis,
    isInitialized,
    isWeb3EnableLoading,
  } = useMoralis();

  //get auth context
  const [AuthState, currentAccount] = useAuth();

  //get update contexts
  const [connectWallet, disConnectWallet] = useAuthUpdate();

  const getGorvernorName = async () => {
    const Contracts = Moralis.Object.extend("GovernanceInstanceCreations");
    const query = new Moralis.Query(Contracts);
    query.equalTo("govAddress", address);
    const results = await query.find();
    let name = results[0].get("govName");
    setName(name);
  };
  const getVotes = async () => {
    const Votes = Moralis.Object.extend("Votes");
    const query = new Moralis.Query(Votes);
    query.equalTo("govAddress", address);
    const results = await query.find();
    let voteNumber = results.length;
    setVotesNumber(voteNumber);
  };
  const getProposals = async () => {
    const Proposals = Moralis.Object.extend("Proposals");
    const query = new Moralis.Query(Proposals);
    query.equalTo("govAddress", address);
    const results = await query.find();
    let proposalsNumber = results.length;
    setProposalsNumber(proposalsNumber);
  };

  const getInfo = async () => {
    const GovernorImages = Moralis.Object.extend("GovernorImages");
    const governorImages = new GovernorImages();
    const query = new Moralis.Query(governorImages);
    query.equalTo("govInfo", address);

    const results = await query.find();
    if (results.length == 0) {
      setImage(false);
    } else {
      setImage(results[0].get("image"));
    }
  };

  useEffect(() => {
    if (isInitialized) {
      getGorvernorName();
      getVotes();
      getProposals();
      getInfo();
    }
  }, [isInitialized]);

  return (
    <div>
      <div className="pt-6 bg-bgGray h-auto px-5 md:px-16 pb-10 relative">
        <nav className="flex" aria-label="Breadcrumb relative">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li>
              <div className="flex items-center">
                <Link to="/" className="text-sm font-medium text-gray-400  ">
                  Home
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <Link
                  to="/holder"
                  className="ml-1 text-sm font-medium text-gray-400 md:ml-2 "
                >
                  Voter
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="ml-1 text-sm font-medium text-black">
                  {name}
                </span>
              </div>
            </li>
          </ol>
        </nav>
      </div>
      <div className="pt-6 bg-bgGray h-auto px-5 md:px-16 pb-10 ">
        <div className="block sm:flex">
          <div className="rounded-full m-auto h-20 w-20 mb-4 sm:h-14 sm:w-14 sm:m-0 ">
            <img
              className="h-full w-full rounded-full "
              alt="coin"
              src={!image ? img : `https://ipfs.infura.io/ipfs/${image}`}
            />
          </div>
          <h2 className="font-medium leading-loose text-3xl pl-4 text-center sm:text-left">
            {name}
          </h2>
          <div className="flex w-fit m-auto sm:ml-0 sm:mt-0">
            {AuthState && (
              <button
                onClick={() => setModal(true)}
                className="w-fit h-fit rounded-full px-4 py-2 ml-3 cursor-pointer mt-3 bg-primaryBtn text-white font-medium"
              >
                create proposal
              </button>
            )}
            {!AuthState && (
              <button className="w-fit h-fit rounded-full px-4 py-2 ml-3 cursor-pointer mt-3 bg-gray-400 hover:bg-gray-500 text-white font-medium">
                create proposal
              </button>
            )}
            {!AuthState && (
              <button
                onClick={() => {
                  connectWallet();
                }}
                className="w-fit h-fit rounded-md px-4 py-2 ml-3 cursor-pointer mt-3 bg-primaryBtn text-white font-medium"
              >
                Join
              </button>
            )}
          </div>
        </div>

        <div className="flex mt-6 gap-2 text-sm  justify-center sm:justify-start ">
          {/*<div className="border-2 p-3 ">
            <div className="text-center font-medium ">132.73k</div>
            <div className="text-center text-gray-500">Members</div>
          </div>*/}
          <div className="border-2 p-3 ">
            <div className="text-center font-medium ">{proposalsNumber}</div>
            <div className="text-center text-gray-500">
              {proposalsNumber > 1 ? "Proposals" : "Proposal"}
            </div>
          </div>
          <div className="border-2 p-3 ">
            <div className="text-center font-medium ">{votesNumber}</div>
            <div className="text-center text-gray-500">
              {votesNumber > 1 ? "Voters" : "Voter"}
            </div>
          </div>
        </div>

        {/* <div className="grid grid-cols-2 mt-6">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex w-fit px-3 border-b-2">
              <div className="w-[100px] text-center font-medium text-xs border-b-2 border-b-primaryBtn cursor-pointer text-primaryBtn hover:border-b-primaryBtn ">
                Proposals
              </div>
              <div className="w-[100px] text-center font-medium text-xs  cursor-pointer hover:border-b-2 hover:border-b-primaryBtn ">
                About
              </div>
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1 mt-4 sm:mt-0">
            <form>
              <div className="relative text-gray-400 text-right  ">
                <span className="absolute y-0 l-0 ">
                  <button
                    type="submit"
                    className="p-1 pt-2 pl-2 focus:outline-none focus:shadow-outline"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </span>

                <input
                  type="text"
                  name="q"
                  className="py-2 text-sm text-gray-500 rounded-full w-full max-w-md pl-10 focus:outline-none  shadow-md cursor-pointer "
                  placeholder="Search..."
                  autoComplete="off"
                />
              </div>
            </form>
          </div>
        </div>*/}
      </div>
      {modalVissible && <ProposalModal hide={setModal} address={address} />}
    </div>
  );
}

export default HolderHero;
