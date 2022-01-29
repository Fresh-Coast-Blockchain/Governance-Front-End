import React, { useEffect, useState } from "react";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { useAuthUpdate, useAuth } from "../../contexts/AuthProvider";
import img from "../../images/img.png";
import ResultModal from "../Modal/ResultModal";

function ResultsCard(props) {
  //get auth context
  const [AuthState, currentAccount] = useAuth();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [modalVissible, setModal] = useState(false);

  const {
    isAuthenticated,

    Moralis,
    isInitialized,
  } = useMoralis();

  //get contract name
  const getGovernorName = async () => {
    const Contracts = Moralis.Object.extend("GovernanceInstanceCreations");
    const query = new Moralis.Query(Contracts);
    query.equalTo("govAddress", props.address);
    const results = await query.find();
    let name = results[0].get("govName");
    setName(name);
  };

  //get contract images
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

  const forYes = () => {
    const result = Moralis.Units.FromWei(props.data.forVotes_);
    return result;
  };
  const forNo = () => {
    const result = Moralis.Units.FromWei(props.data.againstVotes_);
    return result;
  };

  //get percentage for forvotes
  const yesPerc = (yes, no) => {
    let total = Number(yes) + Number(no);
    let result = (Number(yes) / total) * 100;
    result = isNaN(result) && !Number(result) ? 0 : Number(result);
    return result.toFixed();
  };

  //get percentage for againstvotes
  const noPerc = (yes, no) => {
    let total = Number(yes) + Number(no);
    let result = (Number(no) / total) * 100;
    result = isNaN(result) && !Number(result) ? 0 : Number(result);
    return result.toFixed();
  };

  //calculate verdict
  const verdict = (yes, no) => {
    if (Number(yes) !== 0 || Number(no) !== 0) {
      if (Number(yes) > Number(no)) return "Yes";
      if (Number(yes) < Number(no)) return "No";
      if (Number(yes) === Number(no)) return "Draw";
    } else {
      return "N/A";
    }
  };
  useEffect(() => {
    if (isInitialized) {
      getGovernorName();
      getInfo();
    }
  }, [isInitialized, props]);
  return (
    <div>
      <div
        onClick={() => {
          setModal(true);
        }}
        className=" hover:shadow-md col-span-1 bg-white h-auto p-2 py-4 rounded-xl border-2 border-coinCardBorder mb-4 cursor-pointer"
      >
        <div className=" px-2 ">
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
                <h3 className="font-medium text-sm pt-1 pl-2 ">{name}</h3>
              </div>
              <div className="bg-greenShade font-normal w-[100px] flex items-center justify-center text-center text-xs text-yesPoint  sm:ml-2   rounded-full ">
                Finished
              </div>
            </div>

            {/*<p className="text-xs pl-8 sm:pl-8">By: Tremendous crypto group</p>*/}
            <p className="text-sm pt-2 font-normal">
              {props.description.substring(0, 100)}
              {props.description.length > 100 ? "..." : ""}
            </p>
          </div>
        </div>
      </div>
      {modalVissible && (
        <ResultModal
          hide={setModal}
          name={name}
          description={props.description}
          img={!image ? img : `https://ipfs.infura.io/ipfs/${image}`}
          yes={forYes()}
          no={forNo()}
          yesPercent={yesPerc(forYes(), forNo())}
          noPercent={noPerc(forYes(), forNo())}
          verdict={verdict(forYes(), forNo())}
        />
      )}
    </div>
  );
}

export default ResultsCard;
