import React, { useEffect, useState } from "react";
import Card from "../Card/Card";
import { useMoralis } from "react-moralis";
import { Link, useLocation } from "react-router-dom";

function CoinHolderSecond(props) {
  const { Moralis, isInitialized } = useMoralis();
  const [contracts, setContracts] = useState([]);
  //const [searchResult, setResult] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const searchObj = useLocation().search;
  const myQuery = new URLSearchParams(searchObj).get("q");

  const getContracts = async () => {
    const Contracts = Moralis.Object.extend("GovernanceInstanceCreations");
    const query = new Moralis.Query(Contracts);

    const results = await query.find();
    setContracts(results);
    setLoading(false);
  };

  const getContractsForQuery = async (myQuery) => {
    const Contracts = Moralis.Object.extend("GovernanceInstanceCreations");
    const query = new Moralis.Query(Contracts);
    query.startsWith("govName", myQuery);
    const results = await query.find();

    setContracts(results);
    setLoading(false);
  };

  /*const searchArray = (event) => {
    console.log(event.target.value);
    let value = event.target.value.trim();
    if (contracts.length > 0) {
      let match = [];

      contracts.forEach((contract) => {
        let str = contract.get("govName").toUpperCase();
        if (str.search(value.toUpperCase()) > -1) {
          match = [...match, contract];
        }
      });

      if (match.length > 0) {
        setResult(match);
      } else {
        setResult([]);
      }
    }
  };*/

  useEffect(() => {
    //get address
    if (isInitialized) {
      if (myQuery) {
        getContractsForQuery(myQuery);
      } else {
        getContracts();
      }
    }
  }, [isInitialized, myQuery]);
  return (
    <div>
      <div
        className={`px-5 md:px-16 h-auto py-16 ${
          props.page == "home" ? "bg-bgBlue" : "bg-bgGray"
        }`}
      >
        <div className="grid grid-cols-3">
          <h3 className=" font-bold block  text-2xl mb-6 col-span-3 sm:col-span-1 ">
            Join In
          </h3>
          <div className="col-span-3 sm:col-span-2 mb-6  ">
            <form>
              <div className="relative text-gray-400 text-right  ">
                <span className="absolute y-0 l-0 ">
                  <button
                    type="submit"
                    className="p-1 pt-2 focus:outline-none focus:shadow-outline"
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
                  //value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    //searchArray(event);
                  }}
                  className="py-2 text-sm text-gray-500 rounded-full w-full max-w-md pl-10 focus:outline-none shadow-md cursor-pointer "
                  placeholder="Search..."
                  autoComplete="off"
                />
              </div>
            </form>
          </div>
        </div>
        {!loading && contracts.length > 0 && (
          <>
            <div className="md:px-10 grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
              {contracts.map((contract, index) => (
                <Card key={index} contract={contract} />
              ))}
            </div>
            <div className="mt-4">
              <Link
                to="/holder"
                className="text-primaryBtn text-sm pl-10 pt-10 cursor-pointer "
              >
                View more...
              </Link>
            </div>
          </>
        )}
        {!loading && contracts.length == 0 && (
          <div className="md:px-10 grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
            <div className="font-bold text-gray-500 text-lg">
              No match found
            </div>
          </div>
        )}
        {loading && (
          <div className="md:px-10 grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
            <div className="font-bold text-gray-500 text-lg">
              Loading contracts
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CoinHolderSecond;
