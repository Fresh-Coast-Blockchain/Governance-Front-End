import React, { useState, useEffect } from "react";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { useAuthUpdate, useAuth } from "../../contexts/AuthProvider";
import Card from "../Card/Card";

function CreatorCard(props) {
  const [AuthState, currentAccount] = useAuth();
  const [user, setUser] = useState("");
  const { isAuthenticated, isWeb3Enabled, enableWeb3, Moralis, isInitialized } =
    useMoralis();

  useEffect(() => {
    if (isInitialized) {
      if (currentAccount) {
        setUser(currentAccount);
      } else if (isAuthenticated) {
        let accounts = Moralis.User.current();
        let user = accounts.get("accounts")[0];
        setUser(user);
      }
    }
  }, [isInitialized, props.contracts, currentAccount]);
  return (
    <div className="mt-3">
      {props.contracts.map((contract, index) => (
        <Card key={index} contract={contract} />
      ))}
    </div>
  );
}

export default CreatorCard;
