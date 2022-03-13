import React, { useEffect, useState } from "react";
import coin from "../../images/coin.png";
import VoteState from "../VoteState";
import Progress from "../Progress";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { useAuthUpdate, useAuth } from "../../contexts/AuthProvider";
import img from "../../images/img.png";
import DescriptionModal from "../Modal/DescriptionModal";

function CoinCard(props) {
  //get auth context
  const [AuthState, currentAccount] = useAuth();
  const [votesNumber, setVotesNumber] = useState(0);
  const [totalVotes, setTotalVotes] = useState(0);
  const [image, setImage] = useState("");
  const [modalVissible, setModal] = useState(false);

  const {
    isAuthenticated,

    Moralis,
    isInitialized,
  } = useMoralis();

  //set path for user, to vote or not
  const generatePathForUser = async (user) => {
    const Votes = Moralis.Object.extend("Votes");
    const query = new Moralis.Query(Votes);
    query.equalTo("voter", user);
    query.equalTo("proposalId", Number(props.data.proposalId_));
    query.equalTo("govAddress", props.address);
    const results = await query.find();
    let voteNumber = results.length;

    setVotesNumber(voteNumber);
  };

  //check user ability to vote
  const verify = async () => {
    let user;
    if (currentAccount) {
      user = currentAccount;
      generatePathForUser(user);
    } else if (!currentAccount && isAuthenticated) {
      let accounts = Moralis.User.current();
      user = accounts.get("accounts")[0];
      generatePathForUser(user);
    } else {
      setVotesNumber(1);
    }
  };

  //get number votes for proposal

  const getVotesCount = async () => {
    const Votes = Moralis.Object.extend("Votes");
    const query = new Moralis.Query(Votes);
    query.equalTo("proposalId", Number(props.data.proposalId_));
    query.equalTo("govAddress", props.address);
    const results = await query.find();
    let voteNumber = results.length;
    setTotalVotes(voteNumber);
  };

  //get contract image
  const getInfo = async () => {
    const GovernorImages = Moralis.Object.extend("GovernorImages");
    const governorImages = new GovernorImages();
    const query = new Moralis.Query(governorImages);
    query.equalTo("govInfo", props.address);
    const results = await query.find();
    if (results.length == 0) {
      setImage(false);
    } else {
      setImage(results[0].get("image"));
    }
  };

  useEffect(() => {
    verify();
    getVotesCount();
    getInfo();
  }, [currentAccount]);
  return (
    <div>
      <div className=" hover:shadow-md cursor-pointer bg-white h-auto p-2 py-4 rounded-xl border-2 border-coinCardBorder grid grid-cols-2 mb-4">
        <div className="col-span-2 sm:col-span-1 px-2 border-r-0  sm:border-r-2 border-coinCardBorder ">
          <div>
            <div className="flex justify-between">
              <div className="flex">
                <div className="w-6 h-6 rounded-full">
                  <img
                    className="aspect-square mt-1 sm:mt-0 rounded-full"
                    alt="coin"
                    src={!image ? img : `https://ipfs.infura.io/ipfs/${image}`}
                  />
                </div>
                <h3 className="font-medium text-sm pt-1 pl-2 ">
                  {props.title}
                </h3>
              </div>
              <VoteState status={props.status} />
            </div>

            {/*<p className="text-xs pl-8 sm:pl-8">By: Tremendous crypto group</p>*/}
            <p className="text-sm pt-2 font-normal">
              {props.description.substring(0, 100)}
              {props.description.length > 100 ? (
                <span
                  onClick={() => {
                    setModal(true);
                  }}
                  className="text-gray-500 hover:underline"
                >
                  {" "}
                  read more...
                </span>
              ) : (
                ""
              )}
            </p>
          </div>
        </div>
        <div className="col-span-2 sm:col-span-1 px-2 flex  items-center mt-10 sm:mt-0">
          <Progress
            status={props.status}
            data={props.data}
            voteCount={votesNumber}
            totalVotes={totalVotes}
            contractAddress={props.address ? props.address : ""}
          />
        </div>
      </div>
      {modalVissible && (
        <DescriptionModal
          hide={setModal}
          name={props.name}
          description={props.description}
          img={!image ? img : `https://ipfs.infura.io/ipfs/${image}`}
          status={props.status}
        />
      )}
    </div>
  );
}

export default CoinCard;
