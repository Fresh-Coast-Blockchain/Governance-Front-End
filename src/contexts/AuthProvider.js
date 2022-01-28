import React, { useContext, useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { connectors } from "./config";
import Swal from "sweetalert2";

const AuthContext = React.createContext();
const AuthUpdateContext = React.createContext();
const LoaderContext = React.createContext();

//auth hook
export function useAuth() {
  return useContext(AuthContext);
}

//auth update hook
export function useAuthUpdate() {
  return useContext(AuthUpdateContext);
}

export function useLoader() {
  return useContext(LoaderContext);
}

export function AuthProvider({ children }) {
  const {
    isAuthenticated,
    Moralis,
    authenticate,
    logout,
    account,
    isInitialized,
    authError,
    isWeb3Enabled,
  } = useMoralis();
  const [userState, setUser] = useState();
  const [loaderState, setLoader] = useState(false);
  const [connectorClick, setConnectorClick] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");

  //connect wallet
  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      /* const myuser = await authenticate({
        provider: "walletconnect",
        mobileLinks: [
          "rainbow",
          "metamask",
          "argent",
          "trust",
          "imtoken",
          "pillar",
        ],
      });*/
      let web3 = new Moralis.Web3(window.ethereum);
      let netId = await web3.eth.net.getId();
      if (netId !== 43113) {
        Swal.fire({
          title: "Warning!",
          text: "It looks like you are not on Avalanche fuji testnet, please select the right network to access the data",
          icon: "info",
          confirmButtonText: "Ok",
          confirmButtonColor: "#2C6CF4",
        });

        if (connectorClick) {
          setLoader(false);
        }
      } else {
        setLoader(true);
        setConnectorClick(true);
        await authenticate({ provider: "injected" });

        setLoader(false);
        window.location.reload();
      }

      //set auth state from moralis
      //setUser(true);
    } else {
      Swal.fire({
        title: "Error!",
        text: "Your browser is not web3 enabled you can download metamask to enable this.",
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: "#2C6CF4",
      });
    }
  };

  //disconnect wallet
  const disConnectWallet = async () => {
    await logout();
    setUser(false);
  };

  const evaluateAccounts = async (account) => {
    if (typeof window.ethereum !== "undefined") {
      let accountsList = Moralis.User.current();
      if (isAuthenticated && accountsList) {
        let user = accountsList.get("accounts")[0];
        if (account && account !== user) {
          setCurrentAccount(account);
        }
      } else if (!isAuthenticated) {
        setCurrentAccount("");
        //window.location.replace("/");
      }
    }
  };

  Moralis.onChainChanged(async () => {
    let web3 = new Moralis.Web3(window.ethereum);
    let netId = await web3.eth.net.getId();
    if (netId !== 43113) {
      Swal.fire({
        title: "Warning!",
        text: "It looks like you are not on Avalanche fuji testnet, please select the right network to access the data",
        icon: "info",
        confirmButtonText: "Ok",
        confirmButtonColor: "#2C6CF4",
      });

      if (connectorClick) {
        setLoader(false);
      }
    }
  });

  /*const checkNetwork = async () => {
    let web3 = new Moralis.Web3(window.ethereum);
    let netId = await web3.eth.net.getId();
    if (netId !== 43113 && isAuthenticated) {
      Swal.fire({
        title: "Warning!",
        text: "It looks like you are not on Avalanche fuji testnet, please select the right network to access the data",
        icon: "info",
        confirmButtonText: "Ok",
        confirmButtonColor: "#2C6CF4",
      });
    }
  };*/

  /*useEffect(() => {
    checkNetwork();
  }, [isAuthenticated]);*/

  useEffect(() => {
    setUser(isAuthenticated);
    if (authError && connectorClick && typeof window.ethereum !== "undefined") {
      setLoader(false);
      setConnectorClick(false);
      Swal.fire({
        title: "Error!",
        text: "An error occured during authentication. Please check your internet conection and try again",
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: "#2C6CF4",
      });
    }

    if (isInitialized) {
      evaluateAccounts(account);
    }
  }, [isAuthenticated, account, isInitialized, authError]);

  return (
    <AuthContext.Provider value={[userState, currentAccount]}>
      <AuthUpdateContext.Provider value={[connectWallet, disConnectWallet]}>
        <LoaderContext.Provider value={[loaderState, setLoader]}>
          {children}
        </LoaderContext.Provider>
      </AuthUpdateContext.Provider>
    </AuthContext.Provider>
  );
}

export default AuthProvider;
