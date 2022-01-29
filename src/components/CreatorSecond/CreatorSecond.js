import React, { useEffect, useState } from "react";
import { Link, useLinkClickHandler, useParams } from "react-router-dom";
import Card from "../Card/Card";
import ContractFrame from "../Frames/ContractFrame";
import ProposalsFrame from "../Frames/ProposalsFrame";
import AboutFrame from "../Frames/AboutFrame";
import { useMoralis } from "react-moralis";
import { useAuthUpdate, useAuth } from "../../contexts/AuthProvider";

function CreatorSecond() {
  let { section } = useParams();
  const { Moralis, isInitialized, isAuthenticated } = useMoralis();
  const [user, setUser] = useState("");
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  //get auth context
  const [AuthState, currentAccount] = useAuth();

  //get contracts belonging to user
  const getContracts = async () => {
    let user;
    if (!currentAccount && isAuthenticated) {
      let accounts = Moralis.User.current();
      user = accounts.get("accounts")[0];
      setUser(user);
    } else {
      user = currentAccount;
    }
    const Contracts = Moralis.Object.extend("GovernanceInstanceCreations");
    const query = new Moralis.Query(Contracts);
    query.equalTo("govOwner", user);
    const results = await query.find();

    setContracts(results);
    setLoading(false);
  };

  useEffect(() => {
    let subscribed = true;
    if (subscribed) {
      if (isInitialized) {
        if (currentAccount) setUser(currentAccount);
        getContracts();
      }
    }
    return () => {
      // cancel the subscription
      subscribed = false;
    };
  }, [isInitialized, currentAccount, isAuthenticated]);
  return (
    <div>
      <div className="px-5 md:px-16 h-auto py-10 bg-bgGray ">
        <nav className="flex pb-3" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li>
              <div className="flex items-center">
                <a href="#" className="text-sm font-medium text-gray-400  ">
                  Home
                </a>
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
                  Governance Creator
                </span>
              </div>
            </li>
          </ol>
        </nav>
        <div className="flex w-fit  pt-4 border-b-2 px-2">
          <Link
            to="/creator/1"
            className={`w-fit px-2 text-center font-medium text-xs border-b-2 ${
              section == 1 ? "border-b-primaryBtn text-primaryBtn " : ""
            }  hover:border-b-primaryBtn cursor-pointer`}
          >
            Governance contract
          </Link>
          <Link
            to="/creator/2"
            className={`w-fit px-2 text-center font-medium text-xs border-b-2 ${
              section == 2 ? "border-b-primaryBtn text-primaryBtn " : ""
            }  hover:border-b-primaryBtn cursor-pointer`}
          >
            Proposals
          </Link>
          <Link
            to="/creator/3"
            className={`w-fit px-2 text-center font-medium text-xs border-b-2 ${
              section == 3 ? "border-b-primaryBtn text-primaryBtn " : ""
            }  hover:border-b-primaryBtn cursor-pointer`}
          >
            About
          </Link>
        </div>

        {section == 1 && (
          <ContractFrame contracts={contracts} loading={loading} />
        )}
        {section == 2 && <ProposalsFrame contracts={contracts} />}
        {section == 3 && <AboutFrame contracts={contracts} />}
      </div>
    </div>
  );
}

export default CreatorSecond;
