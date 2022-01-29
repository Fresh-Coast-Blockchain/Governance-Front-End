import React, { useState, useEffect } from "react";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { Link, useParams } from "react-router-dom";

function ProposalAbout() {
  const [loading, setLoading] = useState(true);
  const [about, setAbout] = useState("");

  const { isAuthenticated, Moralis, isInitialized, isWeb3EnableLoading } =
    useMoralis();
  const { address, section } = useParams();

  const getDetails = async () => {
    //get the contract about details
    const Governance = Moralis.Object.extend("GovernanceInstanceCreations");
    const query = new Moralis.Query(Governance);
    query.equalTo("govAddress", address);
    const results = await query.find();
    if (results[0].get("about") && results[0].get("about").length > 0) {
      setAbout(results[0].get("about")[0]);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (isInitialized) {
      getDetails();
    }
  }, [isInitialized]);
  return (
    <div>
      {loading && (
        <div className="font-bold text-gray-500 text-lg">Loading About</div>
      )}
      {!loading && !about && (
        <div className="font-bold text-black text-lg">No detail found</div>
      )}
      {!loading && about && (
        <div className="text-lg text-justify leading-relaxed">{about}</div>
      )}
    </div>
  );
}

export default ProposalAbout;
