import { Input } from "postcss";
import React, { useState } from "react";
import img from "../../images/img.png";
import Modal from "../Modal/Modal";

//Declare IPFS
import { create } from "ipfs-http-client";

/* Create an instance of the client */
const client = create("https://ipfs.infura.io:5001/api/v0");

function ContractForm() {
  const [modalVissible, setModal] = useState(false);
  const [caution, setCaution] = useState(false);

  const [buffer, setBuffer] = useState(null);
  const [btnState, setBtnState] = useState(false);
  const [image, setImage] = useState(null);
  const [lockDelay, setLockDelay] = useState("");
  const [voteDelay, setVoteDelay] = useState("");
  const [votePeriod, setVotePeriod] = useState("");
  const [proposalThreshold, setProposalThreshold] = useState("");
  const [voteThreshold, setVoteThreshold] = useState("");
  const [transactionValue, setTransactionValue] = useState("");
  const [name, setName] = useState("");

  const captureFile = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);

    reader.onloadend = async () => {
      let result = await reader.result;
      setBuffer(result);

      setBtnState(true);
      setImage(null);
      const added = await client.add(result);
      console.log(added.path);
      setImage(added.path);
      setBtnState(false);
    };
  };

  const uploadImage = async (description) => {
    console.log("Submitting file to ipfs...");
    // upload the file
    // const added = await client.add(buffer);
  };

  return (
    <div>
      <div className="grid gap-8 grid-cols-2 mt-10">
        <div className="  col-span-2  sm:hidden ">
          <div className="rounded-md bg-white h-auto w-[300px] px-3 py-6 m-auto">
            <div className="text-center my-3 text-xs font-semibold">
              Governance image
            </div>
            <div className="rounded-full relative h-[150px] w-[150px] border-[1px] p-3 border-dashed border-primaryBtn  m-auto">
              <img
                src={!image ? img : `https://ipfs.infura.io/ipfs/${image}`}
                className="rounded-full w-full h-full"
              />
              {btnState && (
                <div className="absolute inset-0 rounded-full bg-black bg-opacity-30 flex justify-center items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex justify-center mt-4">
              <p className=" text-xs">Select an image file from your device</p>
            </div>
            <div className="flex justify-center">
              <input
                type="file"
                accept=".jpg, .jpeg, .png, .gif"
                onChange={captureFile}
                disabled={btnState}
                className="ml-6 file:rounded-md file:border-none file:px-2 file-py-1 file:cursor-pointer mt-6 file:bg-primaryBtn file:text-white file:text-xs leading-6  file:py-2 file:font-semibold"
              />
            </div>
          </div>
        </div>
        <div className="  col-span-2 sm:col-span-1 sm:pr-4">
          <div className="mb-4">
            <input
              className=" appearance-none border rounded-md w-full h-[40px] py-2 px-3 cursor-pointer text-gray-700 leading-tight text-xs focus:outline-primaryBtn "
              type="text"
              placeholder="Governance name"
              onChange={(event) => {
                setName(event.target.value.trim());
              }}
            />
          </div>
          <div className="mb-4">
            <select
              onChange={(event) => {
                setLockDelay(event.target.value);
              }}
              className="form-select appearance-none  border border-solid border-gray-300 rounded-md transition  ease-in  w-full h-[40px] cursor-pointer py-2 px-3 text-gray-400 leading-tight text-xs focus:outline-primaryBtn focus:text-black  "
            >
              <option value="">Time lock delay</option>

              <option value="2">2 days</option>
              <option value="3">3 days</option>
              <option value="4">4 days</option>
              <option value="5">5 days</option>
              <option value="6">6 days</option>
              <option value="7">7 days</option>
              <option value="8">8 days</option>
              <option value="9">9 days</option>
              <option value="10">10 days</option>
              <option value="11">11 days</option>
              <option value="12">12 days</option>
              <option value="13">13 days</option>
              <option value="14">14 days</option>
              <option value="15">15 days</option>
              <option value="16">16 days</option>
              <option value="17">17 days</option>
              <option value="18">18 days</option>
              <option value="19">19 days</option>
              <option value="20">20 days</option>
              <option value="21">21 days</option>
              <option value="22">22 days</option>
              <option value="23">23 days</option>
              <option value="24">24 days</option>
              <option value="25">25 days</option>
              <option value="26">26 days</option>
              <option value="27">27 days</option>
              <option value="28">28 days</option>
              <option value="29">29 days</option>
              <option value="30">30 days</option>
            </select>
          </div>
          <div className="mb-4">
            <select
              onChange={(event) => {
                setVoteDelay(event.target.value);
              }}
              className="form-select appearance-none  border border-solid border-gray-300 rounded-md transition  ease-in  w-full h-[40px] cursor-pointer py-2 px-3 text-gray-400 leading-tight text-xs focus:outline-primaryBtn focus:text-black  "
            >
              <option value="">Voting delay</option>
              <option value="1">1 day</option>
              <option value="2">2 days</option>
              <option value="3">3 days</option>
              <option value="4">4 days</option>
              <option value="5">5 days</option>
              <option value="6">6 days</option>
              <option value="7">7 days</option>
              <option value="8">8 days</option>
              <option value="9">9 days</option>
              <option value="10">10 days</option>
              <option value="11">11 days</option>
              <option value="12">12 days</option>
              <option value="13">13 days</option>
              <option value="14">14 days</option>
              <option value="15">15 days</option>
              <option value="16">16 days</option>
              <option value="17">17 days</option>
              <option value="18">18 days</option>
              <option value="19">19 days</option>
              <option value="20">20 days</option>
              <option value="21">21 days</option>
              <option value="22">22 days</option>
              <option value="23">23 days</option>
              <option value="24">24 days</option>
              <option value="25">25 days</option>
              <option value="26">26 days</option>
              <option value="27">27 days</option>
              <option value="28">28 days</option>
              <option value="29">29 days</option>
              <option value="30">30 days</option>
            </select>
          </div>
          <div className="mb-4">
            <select
              onChange={(event) => {
                setVotePeriod(event.target.value);
              }}
              className="form-select focus:text-black  appearance-none  border border-solid border-gray-300 rounded-md transition  ease-in  w-full h-[40px] cursor-pointer py-2 px-3 text-gray-400 leading-tight text-xs focus:outline-primaryBtn  "
            >
              <option value="">Voting period</option>
              <option value="1">1 day</option>
              <option value="2">2 days</option>
              <option value="3">3 days</option>
              <option value="4">4 days</option>
              <option value="5">5 days</option>
              <option value="6">6 days</option>
              <option value="7">7 days</option>
              <option value="8">8 days</option>
              <option value="9">9 days</option>
              <option value="10">10 days</option>
              <option value="11">11 days</option>
              <option value="12">12 days</option>
              <option value="13">13 days</option>
              <option value="14">14 days</option>
              <option value="15">15 days</option>
              <option value="16">16 days</option>
              <option value="17">17 days</option>
              <option value="18">18 days</option>
              <option value="19">19 days</option>
              <option value="20">20 days</option>
              <option value="21">21 days</option>
              <option value="22">22 days</option>
              <option value="23">23 days</option>
              <option value="24">24 days</option>
              <option value="25">25 days</option>
              <option value="26">26 days</option>
              <option value="27">27 days</option>
              <option value="28">28 days</option>
              <option value="29">29 days</option>
              <option value="30">30 days</option>
            </select>
          </div>
          <div className="mb-4">
            <select
              onChange={(event) => {
                setProposalThreshold(event.target.value);
              }}
              className="form-select appearance-none  focus:text-black border border-solid border-gray-300 rounded-md transition  ease-in  w-full h-[40px] cursor-pointer py-2 px-3 text-gray-400 leading-tight text-xs focus:outline-primaryBtn  "
            >
              <option value="">Proposal threshold</option>
              <option value="1">1</option>
              <option value="10">10</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="500">500</option>
              <option value="1000">1000</option>
            </select>
          </div>
          <div className="mb-4">
            <select
              onChange={(event) => {
                setVoteThreshold(event.target.value);
              }}
              className="form-select focus:text-black  appearance-none  border border-solid border-gray-300 rounded-md transition  ease-in  w-full h-[40px] cursor-pointer py-2 px-3 text-gray-400 leading-tight text-xs focus:outline-primaryBtn  "
            >
              <option value="">Voting threshold</option>
              <option value="1">1</option>
              <option value="10">10</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="500">500</option>
              <option value="1000">1000</option>
            </select>
          </div>
          <div className="mb-4">
            <select
              onChange={(event) => {
                setTransactionValue(event.target.value);
              }}
              className="form-select appearance-none focus:text-black  border border-solid border-gray-300 rounded-md transition  ease-in  w-full h-[40px] cursor-pointer py-2 px-3 text-gray-400 leading-tight text-xs focus:outline-primaryBtn  "
            >
              <option value="">Transaction value</option>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="40">40</option>
              <option value="50">50</option>
              <option value="60">60</option>
              <option value="70">70</option>
              <option value="80">80</option>
              <option value="90">90</option>
              <option value="100">100</option>
            </select>
          </div>
          {image &&
            lockDelay &&
            voteDelay &&
            votePeriod &&
            voteThreshold &&
            proposalThreshold &&
            name &&
            !btnState && (
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setModal(true);
                    setCaution(true);
                  }}
                  className=" w-fit h-fit rounded-md px-2 py-2 cursor-pointer mt-6 bg-secondaryBtn text-white text-xs"
                >
                  Create contract
                </button>
              </div>
            )}
          {(!image ||
            !lockDelay ||
            !voteDelay ||
            !votePeriod ||
            !voteThreshold ||
            !proposalThreshold ||
            !name ||
            btnState) && (
            <div className="flex justify-end">
              <button
                disabled
                className=" w-fit h-fit rounded-md px-2 py-2  mt-6 bg-gray-400 text-white text-xs"
              >
                Create contract
              </button>
            </div>
          )}
        </div>
        <div className="  col-span-1 hidden sm:block ">
          <div className="rounded-md bg-white h-auto w-[300px] px-3 py-6 m-auto">
            <div className="text-center my-3 text-xs font-semibold">
              Governance image
            </div>
            <div className="rounded-full relative h-[150px] w-[150px] border-[1px] p-3 border-dashed border-primaryBtn  m-auto">
              <img
                src={!image ? img : `https://ipfs.infura.io/ipfs/${image}`}
                className="rounded-full w-full h-full"
              />
              {btnState && (
                <div className="absolute inset-0 rounded-full bg-black bg-opacity-30 flex justify-center items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex justify-center mt-4">
              <p className=" text-xs">Select an image file from your device</p>
            </div>
            <div className="flex justify-center">
              <input
                type="file"
                accept=".jpg, .jpeg, .png, .gif"
                onChange={captureFile}
                disabled={btnState}
                className="ml-6 file:rounded-md file:border-none file:px-2 file-py-1 file:cursor-pointer mt-6 file:bg-primaryBtn file:text-white file:text-xs leading-6  file:py-2 file:font-semibold"
              />
            </div>
          </div>
        </div>
      </div>
      {modalVissible && (
        <Modal
          caution={caution}
          hide={setModal}
          values={{
            image,
            lockDelay,
            voteDelay,
            votePeriod,
            voteThreshold,
            proposalThreshold,
            name,
            transactionValue,
          }}
        />
      )}
    </div>
  );
}

export default ContractForm;
