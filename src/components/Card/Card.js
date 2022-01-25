import React, { useState, useEffect } from "react";
import img from "../../images/img.png";
import { Link } from "react-router-dom";
import { useAuthUpdate, useAuth } from "../../contexts/AuthProvider";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";

function Card(props) {
  const [AuthState, currentAccount] = useAuth();
  const [user, setUser] = useState("");
  const [proposalsNumber, setProposalsNumber] = useState(0);
  const [image, setImage] = useState("");
  const { isAuthenticated, isWeb3Enabled, enableWeb3, Moralis, isInitialized } =
    useMoralis();

  const getInfo = async () => {
    const GovernorImages = Moralis.Object.extend("GovernorImages");
    const governorImages = new GovernorImages();
    const query = new Moralis.Query(governorImages);
    query.equalTo("govInfo", props.contract.get("govAddress"));

    const results = await query.find();
    if (results.length == 0) {
      setImage(false);
    } else {
      setImage(results[0].get("image"));
    }
  };

  const getProposals = async () => {
    const Proposals = Moralis.Object.extend("Proposals");
    const query = new Moralis.Query(Proposals);
    query.equalTo("govAddress", props.contract.get("govAddress"));
    const results = await query.find();
    let proposalsNumber = results.length;
    setProposalsNumber(proposalsNumber);
  };
  useEffect(() => {
    if (isInitialized) {
      if (currentAccount) {
        setUser(currentAccount);
      } else if (isAuthenticated) {
        let accounts = Moralis.User.current();
        let user = accounts.get("accounts")[0];
        setUser(user);
      }

      getInfo();
      getProposals();
    }
  }, [isInitialized, currentAccount, props.contract]);
  return (
    <div>
      <div className=" m-auto bg-bgGray rounded-md shadow-md col-span-1 w-full h-full max-h-[304px] max-w-[240px] pb-10">
        <h2 className="text-center font-bold text-md pt-6 first-letter:uppercase">
          {props.contract.get("govName")}
        </h2>

        <img
          className="h-[99px] w-[99px] rounded-full m-auto mt-6"
          alt="coin"
          src={!image ? img : `https://ipfs.infura.io/ipfs/${image}`}
        />

        <p className="text-center font-normal text-xs pt-4">
          {proposalsNumber} {proposalsNumber > 1 ? "proposals" : "proposal"}
        </p>
        <div className="w-full h-auto flex justify-items-center pt-4">
          <Link
            to={`/proposals/${props.contract.get("govAddress")}/1`}
            className="bg-secondaryBtn text-white text-sm font-medium text-center rounded-md px-4 py-2 m-auto cursor-pointer"
          >
            Join
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Card;
