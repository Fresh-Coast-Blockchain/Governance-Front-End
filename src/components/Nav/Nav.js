import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
//import { useMoralis } from "react-moralis";
import { useAuthUpdate, useAuth } from "../../contexts/AuthProvider";
import logo from "../../images/logo.png";

function Nav(props) {
  //get update contexts
  const [connectWallet, disConnectWallet] = useAuthUpdate();

  //get auth context
  const [AuthState, currentAccount] = useAuth();

  const [menu, setMenu] = useState("hidden");
  const [currentPath, setPath] = useState("");
  const path = useLocation().pathname;
  useEffect(() => {
    //get current path
    if (path == "/") {
      setPath("/");
    } else {
      let paths = path.split("/");
      setPath(paths[1]);
    }
  });
  return (
    <div>
      <div className="flex w-full  pt-6 relative">
        <Link to="/" className="  flex w-[85%] lg:w-[25%]">
          <img
            className="w-[30px] h-[30px] lg:w-[40px] lg:h-[40px]  rounded-full mr-1  mt-3 lg:mt-2 "
            src={logo}
          />
          <span className="font-headFont font-bold leading-loose pt-3">
            DAO Architect
          </span>
        </Link>
        <div className="hidden lg:flex w-[55%]   justify-center space-x-8 font-headFont font-medium leading-loose  pt-2">
          <Link
            to="/"
            className={`${
              currentPath == "/" ? "bg-bgGray" : ""
            } hover:bg-bgGray py-1 px-2 rounded-lg  pb-1  cursor-pointer`}
          >
            Home
          </Link>
          <Link
            to="/creator/1"
            className={`${
              currentPath == "creator" ? "bg-bgGray" : ""
            } hover:bg-bgGray py-1 px-2 rounded-lg  pb-1  cursor-pointer`}
          >
            Workbench
          </Link>
          <Link
            to="/holder"
            className={`${
              currentPath == "holder" || currentPath == "proposals"
                ? "bg-bgGray"
                : ""
            } hover:bg-bgGray py-1 px-2 rounded-lg  pb-1  cursor-pointer`}
          >
            Voter
          </Link>
          <Link
            to="/results"
            className={`${
              currentPath == "results" ? "bg-bgGray" : ""
            } hover:bg-bgGray py-1 px-2 rounded-lg  pb-1  cursor-pointer`}
          >
            Results
          </Link>
        </div>
        <div className="hidden lg:flex w-[20%] justify-end">
          {!AuthState && (
            <button
              onClick={connectWallet}
              className="bg-primaryBtn h-full max-h-[50px]  text-white  font-headFont font-medium leading-loose cursor-pointer rounded-2xl  px-2 tracking-wider"
            >
              Connect Wallet
            </button>
          )}
          {AuthState && (
            <button
              onClick={disConnectWallet}
              className="bg-gray-400 w-fit text-gray-600  font-headFont font-medium leading-loose cursor-pointer rounded-2xl p-2 px-2 tracking-wider"
            >
              Disconnect Wallet
            </button>
          )}
        </div>

        <div className="flex w-[15%] lg:hidden pt-3 justify-self-end justify-end">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 cursor-pointer "
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            onClick={(e) => {
              if (menu === "hidden") {
                setMenu("block");
              } else {
                setMenu("hidden");
              }
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </div>

        <div
          className={` ${menu} z-50 absolute lg:hidden top-full px-2 py-4 right-7 h-auto bg-white text-[15px] font-normal shadow rounded-md w-[200px]`}
        >
          <Link to="/">
            <div
              className={`${
                currentPath == "/" ? "bg-bgGray" : ""
              } w-full py-2 hover:bg-bgGray pl-2`}
            >
              Home
            </div>
          </Link>
          <Link to="/creator/1">
            <div
              className={`${
                currentPath == "creator" ? "bg-bgGray" : ""
              } w-full py-2 hover:bg-bgGray pl-2`}
            >
              Workbench
            </div>
          </Link>
          <Link to="/holder">
            <div
              className={`${
                currentPath == "holder" ? "bg-bgGray" : ""
              } w-full py-2 hover:bg-bgGray pl-2`}
            >
              Voter
            </div>
          </Link>
          <Link to="/results">
            <div
              className={`${
                currentPath == "results" ? "bg-bgGray" : ""
              } w-full py-2 hover:bg-bgGray pl-2`}
            >
              Results
            </div>
          </Link>

          {!AuthState && (
            <button
              onClick={connectWallet}
              className="bg-primaryBtn w-full mt-2 text-white  font-headFont font-medium leading-loose cursor-pointer rounded-2xl p-2 px-2 tracking-wider"
            >
              Connect Wallet
            </button>
          )}
          {AuthState && (
            <button
              onClick={disConnectWallet}
              className="bg-gray-400 w-fit mt-2 text-white  font-headFont font-medium leading-loose cursor-pointer rounded-2xl p-2 px-2 tracking-wider"
            >
              Disconnect Wallet
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Nav;
