import React, { useState, useEffect } from "react";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { useAuthUpdate, useAuth } from "../../contexts/AuthProvider";
import Swal from "sweetalert2";

function Modal(props) {
  const [loading, setLoading] = useState(false);
  const [caution, setCaution] = useState(props.caution);
  const [user, setUser] = useState("");
  const [contractCreated, setContratedCreated] = useState(false);
  const { isAuthenticated, isWeb3Enabled, enableWeb3, Moralis, isInitialized } =
    useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();
  const [reload, setReload] = useState(false);
  const [AuthState, currentAccount] = useAuth();

  let lockDelayInSec,
    voteDelayInSec,
    votePeriodInSec,
    voteThresholdInSec,
    proposalThresholdInSec,
    mainTransactionValue;
  const {
    image,
    lockDelay,
    voteDelay,
    votePeriod,
    voteThreshold,
    proposalThreshold,
    name,
    transactionValue,
  } = props.values;
  lockDelayInSec = Number(lockDelay) * 24 * 60 * 60;
  voteDelayInSec = Number(voteDelay) * 2; //4 * 60 * 60;
  votePeriodInSec = Number(votePeriod) * 24 * 60 * 60;
  voteThresholdInSec = Number(voteThreshold) * 24 * 60 * 60;
  proposalThresholdInSec = Number(lockDelay) * 24 * 60 * 60;
  mainTransactionValue = transactionValue ? transactionValue : 0;

  const saveImage = (data) => {
    let hexId = data.events["0"].raw.data.substring(2);
    let _64BytesId = hexId.match(/.{1,64}/g)[0];
    let info = _64BytesId.slice(-40);
    info = "0x" + info;
    console.log(info);
    const GovernorImages = Moralis.Object.extend("GovernorImages");
    const governorImages = new GovernorImages();

    governorImages.set("govInfo", info);
    governorImages.set("image", image);

    governorImages.save().then(
      (governorImages) => {
        setLoading(false);
        setCaution(false);
        setContratedCreated(true);
        window.location.reload();
      },
      (error) => {
        alert("Failed to create new object, with error code: " + error.message);
      }
    );
  };

  async function createGovernance() {
    let web3 = new Moralis.Web3(window.ethereum);
    let netId = await web3.eth.net.getId();
    if (netId === 43113) {
      let options = {
        contractAddress: "0x8728f06Cabc2850B2Faa6Ab6F007129cc3547c95",
        functionName: "createGovernor",
        abi: [
          {
            inputs: [
              {
                internalType: "string",
                name: "_governorName",
                type: "string",
              },
              {
                internalType: "uint256",
                name: "_timelockDelay",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "_votingDelay",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "_votingPeriod",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "_proposalThreshold",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "_votingThreshold",
                type: "uint256",
              },
            ],
            name: "createGovernor",
            outputs: [
              {
                internalType: "address",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "payable",
            type: "function",
          },
        ],
        params: {
          _governorName: name,
          _timelockDelay: lockDelayInSec,
          _votingDelay: voteDelayInSec,
          _votingPeriod: votePeriodInSec,
          _proposalThreshold: proposalThresholdInSec,
          _votingThreshold: voteThresholdInSec,
        },
        //msgValue: Moralis.Units.ETH(0.1),
      };

      await contractProcessor.fetch({
        params: options,
        onSuccess: (data) => {
          saveImage(data);
        },
        onError: (err) => {
          setLoading(false);
          console.log(err);
        },
      });

      /*const receipt = await Moralis.executeFunction(options);
    console.log(receipt);*/
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

  useEffect(() => {
    let subscribed = true;

    if (subscribed) {
      if (isInitialized) {
        if (currentAccount) {
          setUser(currentAccount);
        } else if (isAuthenticated) {
          let accounts = Moralis.User.current();
          let user = accounts.get("accounts")[0];
          setUser(user);
        }
      }
    }
    return () => {
      // cancel the subscription
      subscribed = false;
    };
  }, [isInitialized, currentAccount]);

  return (
    <div>
      <div className="fixed bg-black inset-0 bg-opacity-25 flex items-center justify-center px-3">
        {!loading && (
          <div className="bg-white w-full max-w-[320px] p-4 rounded-md text-justify ">
            {caution && (
              <div>
                <p>
                  <strong>NOTE:</strong>This action can not be done, ensure all
                  details provided are correct.
                </p>
                <div className="flex justify-center space-x-3">
                  <span
                    className="pt-2  text-xs text-primaryBtn cursor-pointer hover:underline"
                    onClick={() => {
                      props.hide(false);
                      setLoading(false);
                    }}
                  >
                    Edit form
                  </span>
                  <button
                    onClick={() => {
                      setLoading(true);
                      createGovernance();
                    }}
                    className=" w-fit h-fit rounded-md px-2 py-2 cursor-pointer  bg-primaryBtn text-white text-xs"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
            {contractCreated && (
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
                  Governance Contract Created Successfully.
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

export default Modal;
