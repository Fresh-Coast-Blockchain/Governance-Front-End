import React, { useState, useEffect } from "react";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import ResultsCard from "../Card/ResultsCard";
import { useAuthUpdate, useAuth } from "../../contexts/AuthProvider";
import Swal from "sweetalert2";

function ResultList() {
  //get auth context
  const [AuthState, currentAccount] = useAuth();
  const [user, setUser] = useState("");
  const [filter, setFilter] = useState("finished");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [proposalList, setProposals] = useState([]);
  const {
    isAuthenticated,

    Moralis,
    isInitialized,
  } = useMoralis();

  const contractProcessor = useWeb3ExecuteFunction();

  //filter proposals for finished proposals
  const filterOutCome = (list) => {
    let result = [];
    list.forEach((item) => {
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

  //get proposal data from chain
  const getProposalData = async (id, description, address, title) => {
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

    //return proposal detail
    return {
      data: proposal,
      description: description,
      address: address,
      title: title,
    };
  };

  //get proposals for a contract
  const getGovernorProposals = async () => {
    //check if user is on the right chain
    let web3 = new Moralis.Web3(window.ethereum);
    let netId = await web3.eth.net.getId();
    if (netId === 43113) {
      setLoading(true);
      const Proposals = Moralis.Object.extend("Proposals");

      const query = new Moralis.Query(Proposals);
      query.notEqualTo("govAddress", false);
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
          //get hex of id
          hexId = mydata.events["0"].raw.data.substring(2);
          //get the second 64bytes
          _64BytesId = hexId.match(/.{1,64}/g)[1];
          _64BytesId.replace(/^0+/, "");
          //get the id by removing leading zeros
          //proposalId = _64BytesId.charAt(_64BytesId.length - 1);
          proposalId = _64BytesId.replace(/^0+/, "");

          let detail = await getProposalData(
            proposalId,
            description,
            results[i].get("govAddress"),
            title
          );
          //push proposal into list
          proposalData = [...proposalData, detail];
        }

        //get filtered outcome
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

  useEffect(() => {
    if (isInitialized) {
      if (typeof window.ethereum !== "undefined") {
        getGovernorProposals();
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
  }, [isInitialized, currentAccount, filter]);
  return (
    <div>
      <div>
        {loading && (
          <div className="font-semibold text-lg text-gray-600 mt-6">
            Loading Results...
          </div>
        )}
        {proposalList.length > 0 && !loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            {proposalList.map((proposal, index) => {
              if (proposal.data)
                return (
                  <ResultsCard
                    key={index}
                    data={proposal.data}
                    description={proposal.description}
                    title={proposal.title}
                    address={proposal.address}
                  ></ResultsCard>
                );
              return <span key={index}></span>;
            })}
          </div>
        )}
        {proposalList.length === 0 && !loading && (
          <div className="font-semibold text-lg text-gray-600">
            No Results Found.
          </div>
        )}
      </div>
    </div>
  );
}

export default ResultList;
