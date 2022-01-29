import React, { useState, useEffect } from "react";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { useAuthUpdate, useAuth } from "../../contexts/AuthProvider";
import Swal from "sweetalert2";

function ProposalModal(props) {
  //get auth context
  const [AuthState, currentAccount] = useAuth();
  const [loading, setLoading] = useState(false);
  const [caution, setCaution] = useState(false);

  const [account, setAccount] = useState("");
  const [user, setUser] = useState("");
  const [proposal, setProposal] = useState("");
  const [proposalCreated, setProposalCreated] = useState(false);
  const [form, setForm] = useState(true);
  const { isAuthenticated, Moralis, isInitialized } = useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();

  const handleProposalIns = (event) => {
    setProposal(event.target.value);
  };

  async function delegate() {
    //check if user is on the right chain
    let web3 = new Moralis.Web3(window.ethereum);
    let netId = await web3.eth.net.getId();
    if (netId === 43113) {
      //check if user is delegated
      const Delegations = Moralis.Object.extend("Delegations");
      const query = new Moralis.Query(Delegations);
      query.equalTo("delegator", user);
      const results = await query.find();

      if (results.length == 0) {
        //prepare delegation
        let options = {
          contractAddress: "0x364ba491b1201a9c0bd326144cd6472e5ff299f1",
          functionName: "delegate",
          abi: [
            {
              inputs: [
                {
                  internalType: "address",
                  name: "delegatee",
                  type: "address",
                },
              ],
              name: "delegate",
              outputs: [],
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
          params: {
            delegatee: user,
          },
          //msgValue: Moralis.Units.ETH(0.1),
        };
        //delegate
        await contractProcessor.fetch({
          params: options,
          onSuccess: () => {
            //store on moralis
            const NewDelegate = Moralis.Object.extend("Delegations");
            const newDelegate = new NewDelegate();

            newDelegate.set("isDelegated", true);
            newDelegate.set("delegator", user);
            newDelegate.save().then((data) => {
              //make proposal
              makeProposal();
            });
          },
          onError: (err) => {
            setLoading(false);
            setCaution(false);
            props.hide(false);
            Swal.fire({
              title: "Error!",
              text: "An error occured during transaction",
              icon: "error",
              confirmButtonText: "Ok",
              confirmButtonColor: "#2C6CF4",
            });
          },
        });

        /*const receipt = await Moralis.executeFunction(options);
      console.log(receipt);*/
      } else {
        makeProposal();
      }
    } else {
      Swal.fire({
        title: "Warning!",
        text: "It looks like you are not on Avalanche fuji testnet, please select the right network to continue",
        icon: "info",
        confirmButtonText: "Ok",
        confirmButtonColor: "#2C6CF4",
      });
    }
  }

  //make proposal
  async function makeProposal() {
    let options = {
      contractAddress: props.address,
      functionName: "propose",
      abi: [
        {
          inputs: [
            {
              internalType: "address[]",
              name: "targets",
              type: "address[]",
            },
            {
              internalType: "uint256[]",
              name: "values",
              type: "uint256[]",
            },
            {
              internalType: "string[]",
              name: "signatures",
              type: "string[]",
            },
            {
              internalType: "bytes[]",
              name: "calldatas",
              type: "bytes[]",
            },
            {
              internalType: "string",
              name: "description",
              type: "string",
            },
          ],
          name: "propose",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      params: {
        targets: [],
        values: [],
        signatures: [],
        calldatas: [],
        description: proposal,
      },
      //msgValue: Moralis.Units.ETH(0.1),
    };
    await Moralis.enableWeb3();

    await contractProcessor.fetch({
      params: options,
      onSuccess: (id) => {
        //store on moralis
        const Proposals = Moralis.Object.extend("Proposals");
        const proposals = new Proposals();

        proposals.set("proposalId", id);
        proposals.set("description", proposal);
        proposals.set("proposer", user);
        proposals.set("govAddress", props.address);

        proposals.save().then(
          (proposals) => {
            setLoading(false);
            setCaution(false);
            setProposalCreated(true);
            //reload page
            window.location.reload();
          },
          (error) => {
            alert(
              "Failed to create new object, with error code: " + error.message
            );
          }
        );
      },
      onError: (err) => {
        Swal.fire({
          title: "Error!",
          text: "An error occured during transaction",
          icon: "error",
          confirmButtonText: "Ok",
          confirmButtonColor: "#2C6CF4",
        });
        setLoading(false);
        setCaution(false);
        props.hide(false);
      },
    });
    //const id = await Moralis.executeFunction(options);
  }

  useEffect(() => {
    if (isInitialized) {
      if (currentAccount) {
        setUser(currentAccount);
        let accounts = Moralis.User.current();
        setAccount(accounts);
      } else if (!currentAccount && isAuthenticated) {
        let accounts = Moralis.User.current();
        setAccount(accounts);
        let user = accounts.get("accounts")[0];
        setUser(user);
      }
    }
  }, [isInitialized, currentAccount]);

  return (
    <div>
      <div className="fixed z-50 bg-black inset-0 bg-opacity-25 flex items-center justify-center px-3">
        {!loading && (
          <div className="bg-white w-full max-w-[400px] p-4 rounded-md text-justify ">
            {caution && (
              <div>
                <p>
                  <strong>NOTE:</strong> Once created this proposal cannot be modified.             </p>
                <div className="flex justify-center space-x-3">
                  <span
                    className="pt-2  text-xs text-primaryBtn cursor-pointer hover:underline"
                    onClick={() => {
                      setForm(true);
                      setLoading(false);
                      setCaution(false);
                    }}
                  >
                    Edit form
                  </span>
                  <button
                    onClick={() => {
                      setLoading(true);
                      delegate();
                    }}
                    className=" w-fit h-fit rounded-md px-2 py-2 cursor-pointer  bg-primaryBtn text-white text-xs"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
            {proposalCreated && (
              <div>
                <div className="m-auto h-[60px] w-[60px] rounded-full text-white flex justify-center items-center bg-yesPoint">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="font-bold text-lg text-center">
                  Proposal Created Successfully.
                </h3>
                <div className="flex justify-center ">
                  <span
                    className="pt-2  text-xs text-primaryBtn cursor-pointer hover:underline"
                    onClick={() => props.hide(false)}
                  >
                    Close
                  </span>
                </div>
              </div>
            )}
            {form && (
              <div>
                <div className="m-auto h-[200px] w-full  text-white  ">
                  <textarea
                    onChange={handleProposalIns}
                    value={proposal}
                    className="w-full h-full bg-gray-100 text-black p-2 outline-0 text-xs"
                  ></textarea>
                </div>

                <div className="flex justify-center space-x-2  ">
                  <span
                    className="py-2 px-2 mt-2   text-xs text-primaryBtn bg-bgGray rounded-md cursor-pointer hover:underline "
                    onClick={() => {
                      setProposal("");
                      setForm(false);
                      props.hide(false);
                    }}
                  >
                    Cancel
                  </span>
                  <span
                    className="py-2 px-2 mt-2   text-xs bg-primaryBtn text-white rounded-md cursor-pointer "
                    onClick={() => {
                      if (!proposal) {
                        props.hide(false);
                      } else {
                        setCaution(true);
                        setForm(false);
                      }
                    }}
                  >
                    Propose
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
        {loading && (
          <div>
            <div className="m-auto bg-primaryBtn h-[40px] w-[80px] rounded-full flex items-center justify-center space-x-2">
              <div className="bg-white rounded-full p-2 animate-bounce"></div>
              <div className="bg-white rounded-full p-2 animate-bounce"></div>
              <div className="bg-white rounded-full p-2 animate-bounce"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProposalModal;
