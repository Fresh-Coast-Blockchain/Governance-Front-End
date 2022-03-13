import React, { useState, useEffect } from "react";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import ProposalList from "../ProposalList/ProposalList";
import { Link, useParams } from "react-router-dom";
import ProposalAbout from "../ProposalList/ProposalAbout";
import { useAuthUpdate, useAuth } from "../../contexts/AuthProvider";
import Swal from "sweetalert2";

function HolderSecond() {
  //get auth context
  const [AuthState, currentAccount] = useAuth();
  const [user, setUser] = useState("");
  const [filter, setFilter] = useState("active");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [proposalList, setProposals] = useState([]);
  const {
    isAuthenticated,

    Moralis,
    isInitialized,
    isWeb3EnableLoading,
  } = useMoralis();
  const { address, section } = useParams();

  const contractProcessor = useWeb3ExecuteFunction();

  //filter outcome based on selected proposal status
  const filterOutCome = (list) => {
    let result = [];
    list.forEach((item) => {
      console.log(item.data.state_);
      if (filter == "all") {
        result = [...result, item];
      } else if (filter == "pending" && item.data.state_ == 0) {
        result = [...result, item];
      } else if (filter == "active" && item.data.state_ == 1) {
        result = [...result, item];
      } else if (filter == "finished" && item.data.state_ > 1) {
        result = [...result, item];
      }
    });
    return result;
  };

  //get proposal data based on id
  const getProposalData = async (id, description, title) => {
    const ABI = [
      {
        inputs: [
          {
            internalType: "uint256",
            name: "proposalId",
            type: "uint256",
          },
        ],
        name: "getProposalData",
        outputs: [
          {
            internalType: "uint256",
            name: "proposalId_",
            type: "uint256",
          },
          {
            internalType: "string",
            name: "proposalTitle_",
            type: "string",
          },
          {
            internalType: "address",
            name: "proposer_",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "startTime_",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "endTime_",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "startBlock_",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "forVotes_",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "againstVotes_",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "canceled_",
            type: "bool",
          },
          {
            internalType: "bool",
            name: "executed_",
            type: "bool",
          },
          {
            internalType: "enum VoteGovernorAlpha.ProposalState",
            name: "state_",
            type: "uint8",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ];

    const options = {
      contractAddress: address,
      functionName: "getProposalData",
      abi: ABI,
      params: {
        proposalId: id,
      },
    };

    await Moralis.enableWeb3();

    let proposal = await Moralis.executeFunction(options);

    return {
      data: proposal,
      description: description,
      title: title,
    };
  };

  //get proposals for each contract
  const getGovernorProposals = async () => {
    //check if user is on right chain
    let web3 = new Moralis.Web3(window.ethereum);
    let netId = await web3.eth.net.getId();
    if (netId === 43113) {
      setLoading(true);
      const Proposals = Moralis.Object.extend("Proposals");
      const query = new Moralis.Query(Proposals);
      query.equalTo("govAddress", address);
      const results = await query.find();

      if (results.length > 0) {
        let description;
        let mydata;
        let hexId;
        let _64BytesId;
        let proposalId;
        let title;

        let proposalData = [];

        // Do something with the returned Moralis.Object values
        for (let i = 0; i < results.length; i++) {
          const object = results[i];
          description = object.get("description");
          title = object.get("title");
          mydata = object.get("proposalId");
          //get id hex
          hexId = mydata.events["0"].raw.data.substring(2);
          //get second 64byte
          _64BytesId = hexId.match(/.{1,64}/g)[1];
          //proposalId = _64BytesId.charAt(_64BytesId.length - 1);
          //get id leaving leading zeros
          proposalId = _64BytesId.replace(/^0+/, "");
          let detail = await getProposalData(proposalId, description, title);
          console.log(detail);
          //store proposal in array
          proposalData = [...proposalData, detail];
        }

        //filter list
        let outCome = filterOutCome(proposalData);
        setProposals(outCome);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);

      Swal.fire({
        title: "Warning!",
        text: "It looks like you are not on Avalanche fuji testnet, please select the right network to access the data",
        icon: "info",
        confirmButtonText: "Ok",
        confirmButtonColor: "#2C6CF4",
      });
    }
  };

  //get name of selected contract

  const getGorvernorName = async () => {
    const Contracts = Moralis.Object.extend("GovernanceInstanceCreations");
    const query = new Moralis.Query(Contracts);
    query.equalTo("govAddress", address);
    const results = await query.find();
    let name = results[0].get("govName");
    setName(name);
  };

  useEffect(() => {
    let subscribed = true;

    if (subscribed) {
      if (isInitialized) {
        if (typeof window.ethereum !== "undefined") {
          getGovernorProposals();
          getGorvernorName();
          if (currentAccount) {
            setUser(currentAccount);
          } else if (isAuthenticated) {
            let accounts = Moralis.User.current();
            let user = accounts.get("accounts")[0];
            setUser(user);
          }
        } else {
          Swal.fire({
            title: "Error!",
            text: "Your browser is not web3 enabled you can download metamask to enable this.",
            icon: "error",
            confirmButtonText: "Ok",
            confirmButtonColor: "#2C6CF4",
          });
          setLoading(false);
        }
      }
    }
    return () => {
      // cancel the subscription
      subscribed = false;
    };
  }, [isInitialized, currentAccount, filter]);

  return (
    <div>
      <div className="px-5 md:px-16 h-auto min-h-screen pt-2 pb-6 bg-bgGray">
        <div className="grid grid-cols-2 mt-6 mb-4">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex w-fit px-3 border-b-2">
              <Link
                to={`/proposals/${address}/1`}
                className={`w-[100px] text-center font-medium text-xs   ${
                  section == 1
                    ? "border-b-2 border-b-primaryBtn text-primaryBtn cursor-pointer"
                    : ""
                }  cursor-pointer  hover:border-b-2  hover:border-b-primaryBtn `}
              >
                Proposals
              </Link>
              <Link
                to={`/proposals/${address}/2`}
                className={`w-[100px] text-center font-medium text-xs  ${
                  section == 2
                    ? "border-b-2 border-b-primaryBtn text-primaryBtn cursor-pointer"
                    : ""
                }  cursor-pointer hover:border-b-2 hover:border-b-primaryBtn `}
              >
                About
              </Link>
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1 mt-4 sm:mt-0">
            {/*<form className="w-full">
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
            </form>*/}
            {section == 1 && (
              <div className="  relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 absolute inset-y-7 right-2  "
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                <form className="w-full flex justify-end">
                  <select
                    onChange={(event) => {
                      setFilter(event.target.value);
                    }}
                    value={filter}
                    className="form-select appearance-none bg-coinCardBorder mt-4   rounded-md transition  ease-in-out  w-full sm:max-w-[250px] h-[40px] cursor-pointer py-2 px-3  leading-tight text-xs focus:outline-primaryBtn  "
                  >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="finished">Finished</option>
                  </select>
                </form>
              </div>
            )}
          </div>
        </div>
        {section == 1 && (
          <div>
            {loading && (
              <div className="font-semibold text-lg text-gray-600">
                Loading Proposals
              </div>
            )}
            {proposalList.length > 0 && !loading && (
              <ProposalList proposals={proposalList} govName={name} />
            )}
            {proposalList.length === 0 && !loading && (
              <div className="font-semibold text-lg text-gray-600">
                No Proposals Found on {filter} proposals list
              </div>
            )}
          </div>
        )}

        {section == 2 && <ProposalAbout />}
      </div>
    </div>
  );
}

export default HolderSecond;
