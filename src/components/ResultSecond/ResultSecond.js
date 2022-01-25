import React, { useEffect, useState } from "react";
import { Link, useLinkClickHandler, useParams } from "react-router-dom";
import Card from "../Card/Card";
import ContractFrame from "../Frames/ContractFrame";
import ProposalsFrame from "../Frames/ProposalsFrame";
import AboutFrame from "../Frames/AboutFrame";
import { useMoralis } from "react-moralis";
import { useAuthUpdate, useAuth } from "../../contexts/AuthProvider";
import ResultList from "../ResultList/ResultList";

function ResultSecond() {
  let { section } = useParams();
  const { Moralis, isInitialized, isAuthenticated } = useMoralis();
  const [user, setUser] = useState("");
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  //get auth context
  const [AuthState, currentAccount] = useAuth();

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
                  Result
                </span>
              </div>
            </li>
          </ol>
        </nav>
        <h2 className="pt-8 font-bold text-2xl pb-4">Finished proposals</h2>
        {/*<p className="text-lg">
          <strong>NOTE:</strong> You will only be able to create a governance
          contract once, and you will not be able to change any information once
          your governance contract is successfully created.
        </p>*/}

        <ResultList />
        {/*content */}
      </div>
    </div>
  );
}

export default ResultSecond;
