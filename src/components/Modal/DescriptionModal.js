import React, { useState, useEffect } from "react";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { useAuthUpdate, useAuth } from "../../contexts/AuthProvider";
import Swal from "sweetalert2";
import VoteState from "../VoteState";

function DescriptionModal(props) {
  //get auth context
  const [AuthState, currentAccount] = useAuth();
  const [loading, setLoading] = useState(false);
  const [caution, setCaution] = useState(false);
  const [section, setSection] = useState(2);

  const [account, setAccount] = useState("");
  const [user, setUser] = useState("");
  const [proposal, setProposal] = useState("");
  const [proposalCreated, setProposalCreated] = useState(false);
  const [form, setForm] = useState(true);
  const { isAuthenticated, isWeb3Enabled, enableWeb3, Moralis, isInitialized } =
    useMoralis();
  const contractProcessor = useWeb3ExecuteFunction();

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
  }, [isInitialized, currentAccount, props]);

  return (
    <div>
      <div className="fixed z-50 bg-bgBlue inset-0 bg-opacity-25 flex items-center justify-center px-3">
        {!loading && (
          <div className="bg-white w-full max-w-[400px] h-auto max-h-screen min-h-[200px] overflow-auto overscroll-none p-4 rounded-md text-justify relative">
            {/**links */}
            <div className="flex w-fit  pt-4 border-b-2 px-2 ">
              <div
                className={`w-fit px-2 text-center font-medium text-xs ${
                  section == 2
                    ? "border-b-2  border-b-primaryBtn text-primaryBtn "
                    : ""
                } hover:border-b-2  hover:border-b-primaryBtn cursor-pointer`}
              >
                Description
              </div>
            </div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute right-4 top-4 cursor-pointer"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              onClick={() => props.hide()}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>

            {/**contents */}

            <div>
              <div className="m-auto  w-full    ">
                <div className=" bg-white h-auto p-2 py-4  mb-4 ">
                  <div className=" px-2 ">
                    <div>
                      <div className="flex justify-between">
                        <div className="flex">
                          <div className="w-6 h-6 rounded-full">
                            <img
                              className="aspect-square mt-1 sm:mt-0 rounded-full"
                              alt="coin"
                              src={props.img}
                            />
                          </div>
                          <h3 className="font-medium text-black text-sm pt-1 pl-2 ">
                            {props.name}
                          </h3>
                        </div>
                        <VoteState status={props.status} />
                      </div>

                      {/*<p className="text-xs pl-8 sm:pl-8">
                        By: Tremendous crypto group
                      </p>*/}
                    </div>

                    {section === 1 && (
                      <div className="w-full">
                        <div className=" w-full ">
                          <div className=" flex pt-4">
                            <div className="bg-yesPoint h-2 w-2 rounded-full mt-1"></div>
                            <div className="text-xs  ml-2">
                              <span className="font-bold">votes for:</span>{" "}
                              {props.yes}({props.yesPercent}%)
                            </div>
                          </div>
                          <div className="w-full h-2 bg-gray-300 rounded-full relative mt-2 ">
                            <div
                              className="rounded-l h-full bg-yesPoint inline-block absolute top-0 left-0"
                              style={{ width: "70%" }}
                            ></div>
                          </div>
                        </div>
                        <div className=" w-full ">
                          <div className=" flex pt-4">
                            <div className="bg-noPoint h-2 w-2 rounded-full mt-1"></div>
                            <div className="text-xs  ml-2">
                              <span className="font-bold">votes against:</span>{" "}
                              {props.no}({props.noPercent}%)
                            </div>
                          </div>
                          <div className="w-full h-2 bg-gray-300 rounded-full relative mt-2 ">
                            <div
                              className="rounded-l h-full bg-noPoint inline-block absolute top-0 left-0"
                              style={{ width: "30%" }}
                            ></div>
                          </div>
                        </div>

                        <div className="pt-4 mb-3">
                          <span className="font-semibold text-xs pl-2">
                            Approval Rating:
                          </span>
                          <span className="text-xs pl-1">
                            ({props.yesPercent}%)
                          </span>
                          <span className="font-semibold text-xs pl-2">
                            Quorom:
                          </span>
                          <span className="text-xs pl-1">
                            ({props.verdict})
                          </span>
                        </div>

                        {/*<div className="text-right text-xs">
                          Voting created on Jan 16th, 2021.
                        </div>
                        <div className="text-right text-xs">
                          Voting ended on Jan 31st, 2021.
                        </div>*/}
                      </div>
                    )}

                    {section === 2 && (
                      <div className="text-sm pt-4">{props.description}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
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

export default DescriptionModal;
