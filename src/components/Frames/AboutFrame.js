import React, { useState, useEffect } from "react";
import { useMoralis, useWeb3ExecuteFunction } from "react-moralis";
import { useAuthUpdate, useAuth } from "../../contexts/AuthProvider";

function AboutFrame(props) {
  const [about, setAbout] = useState("");
  const [oldAbout, setOldAbout] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);
  const [AuthState, currentAccount] = useAuth();

  const { isAuthenticated, isWeb3Enabled, enableWeb3, Moralis, isInitialized } =
    useMoralis();

  const handleAboutIns = (event) => {
    setAbout(event.target.value);
  };

  //save about information
  const updateTable = async () => {
    // Create the object.
    const Governance = Moralis.Object.extend("GovernanceInstanceCreations");
    const query = new Moralis.Query(Governance);
    query.equalTo("govAddress", address);
    const results = await query.find();
    results[0].set("about", [about]);
    results[0].save().then((data) => {
      // Now let's update it with some new data. In this case, only canFly and energy
      // will get sent to the cloud. ownerName hasn't changed.
      setReload(true);
    });
  };

  const uploadData = () => {
    if (about.trim().length > 0) updateTable();
  };

  //get about information of a contract
  const getDetails = () => {
    let address = props.contracts[0].get("govAddress");

    setAddress(address);
    if (
      props.contracts[0].get("about") &&
      props.contracts[0].get("about").length > 0
    )
      setOldAbout(props.contracts[0].get("about")[0]);

    setLoading(false);
  };

  useEffect(() => {
    if (isInitialized && props.contracts.length > 0) {
      getDetails();
    }
  }, [isInitialized, props.contracts, reload]);

  return (
    <div>
      {!oldAbout && !loading && (
        <div>
          <h2 className="pt-8 font-bold text-2xl pb-4">
            Talk about your governance
          </h2>
          <p className="text-lg">
            Tell users about your governance by providing more insight into who
            is involved, the purpose of gonernance and effects that they can
            make.
          </p>
        </div>
      )}

      <div className="mt-8">
        {!AuthState && (
          <div className="font-semibold text-lg text-gray-600">
            Please connect a wallet
          </div>
        )}
        <div>
          {oldAbout && !loading && AuthState && (
            <p className="text-lg text-justify leading-relaxed">{oldAbout}</p>
          )}
        </div>

        <div className="w-full max-w-[600px] ">
          <form>
            {!oldAbout && !loading && AuthState && (
              <div>
                <textarea
                  onChange={handleAboutIns}
                  value={about}
                  className="w-full h-[300px] p-3 text-xs focus:outline-primaryBtn rounded-md"
                ></textarea>

                <div className="flex justify-end">
                  <button
                    onClick={(event) => {
                      event.preventDefault();
                      uploadData();
                    }}
                    className=" w-fit h-fit rounded-md px-2 py-2 cursor-pointer mt-6 bg-secondaryBtn text-white text-xs"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default AboutFrame;
