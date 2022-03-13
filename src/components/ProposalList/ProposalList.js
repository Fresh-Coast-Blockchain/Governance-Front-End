import React, { useState, useEffect } from "react";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import CoinCard from "../Card/CoinCard";
import { Link, useParams } from "react-router-dom";

function ProposalList(props) {
  const [user, setUser] = useState("");
  const { address } = useParams();
  const {
    isAuthenticated,

    Moralis,
    isInitialized,
    isWeb3EnableLoading,
  } = useMoralis();

  useEffect(() => {
    let subscribed = true;

    //if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3();
    if (subscribed) {
      if (isInitialized) {
        //getProposalCount();
        if (isAuthenticated) {
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
  }, [isInitialized]);
  return (
    <div>
      {props.proposals.map((proposal, index) => {
        if (proposal.data)
          return (
            <CoinCard
              key={index}
              status={Number(proposal.data.state_)}
              data={proposal.data}
              description={proposal.description}
              title={proposal.title}
              name={props.govName}
              address={props.address ? props.address : address}
            ></CoinCard>
          );
        return <span key={index}></span>;
      })}
    </div>
  );
}

export default ProposalList;
