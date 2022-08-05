import React, { useEffect, useState } from "react";
import "./App.css";
import Form from "./components/Form";
import Developer from "./components/Developer";
import { ethers } from "ethers";
import nftpic from "./images/nftpic.png";
import anchorImage from "./images/anchor.svg";
import useMetamaskConnect from "./hooks/useMetamaskConnect";
import DevRegAbi from "./abis/DevReg.json";
import contract from "./constants/contract";

const developer = {
  username: "Devvie",
  title: "Cool dude",
  reputationPoints: 100,
  openToWork: false,
  bio: "Cool dude",
  githubUsername: "stanleyugwu",
  regDate: Date.now(),
  walletAddress: "0x12323453456555",
  devPicUrl: nftpic,
};

const arra: typeof developer[] = new Array(10).fill(developer);

// format wallet address
export const formatAddress = (addr: string) =>
  addr.substr(0, 17) + "..." + addr.substring(38);

// STATIC ELEMENTS
const StaticMetamaskInstruction = (
  <div className="absolute bg-neutral-100 inset-0 flex flex-col text-center items-center justify-center">
    <div className="rounded-xl p-4 w-11/12 xl:w-7/12 h-1/2 bg-dark text-center flex justify-center items-center flex-col">
      <h2 className="font-semibold text-lime-500 text-2xl mt-4 mb-6">
        YOU NEED TO INSTALL METAMASK EXTENSION TO USE THIS APP
      </h2>
      <a
        className="p-3 bg-lime-500 text-white rounded-lg px-4 font-semibold hover:bg-lime-600 inline-block"
        href="https://metamask.io/download/"
        target={"_blank"}
        rel="noreferrer"
      >
        Download Extension
      </a>
    </div>
  </div>
);
const StaticLoader = (
  <div className="absolute bg-dark inset-0 flex flex-col text-center items-center justify-center">
    <p className="text-6xl text-red-600 animate-pulse">❤❤</p>
    <h1 className="font-semibold text-lime-500 text-2xl mt-4 space-x-4">
      TALENTS LOADING...HANG ON 💪
    </h1>
  </div>
);

function App() {
  // one state variable for three states:
  // undefined = loading, [] = no devs, false = error, [data] = fetched data
  const [developers, setDevelopers] = useState<typeof arra | undefined | false>(
    undefined
  );
  const { metamaskInstalled, connectToMetamask, walletInfo } =
    useMetamaskConnect();
  const [metamaskWarningVisible, setMetamaskWarningVisible] = useState(false);
  const [signupFormVisible, setSignupFormVisible] = useState(false);

  const fetchDevs = async () => {
    developers !== undefined && setDevelopers(undefined);
    // we wrap everything in try catch so to be able to catch connection error
    try {
      // lets create a fresh goerli provider for making calls to blockchain
      // we dont need a signer or `from address` since this function just sends a message call to our node
      const goerliProvider = new ethers.providers.JsonRpcProvider(
        "https://rpc.goerli.mudit.blog/",
        5
      );

      // connected to goerli provider
      // lets initialise our contract and after that, every call to contract methods will be
      // made via the contract's provider i.e `goerliProvider`
      let contractAbi: ethers.ContractInterface = DevRegAbi;
      const myContract = new ethers.Contract(
        contract.CONTRACT_ADDRESS,
        contractAbi,
        goerliProvider
      );

      // get all registered devs
      const devs = await myContract.getAllDevs();
      setDevelopers(devs);
    } catch (error: any) {
      console.log(error.message);
      setDevelopers(false);
      console.log("ERROR CONNECTING");
    }
  };

  // handles when user clicks on register
  const handleRegister = async () => {
    if (!metamaskInstalled) return setMetamaskWarningVisible(true);
    if (!walletInfo?.address) return connectToMetamask();
    setSignupFormVisible(true);
  };

  useEffect(() => {
    fetchDevs();
  }, []);

  if (metamaskWarningVisible) return StaticMetamaskInstruction;
  if (developers === undefined) return StaticLoader;

  return (
    <div className="App h-full w-full">
      <header className="p-2 bg-dark flex flex-row justify-around items-center flex-wrap">
        <div>
          <h1
            style={{ fontFamily: "cursive" }}
            className="text-white text-4xl font-semibold"
          >
            {"<DevReg/>"}
          </h1>
          <p className="text-white font-semibold mb-4">
            Developer registry for the talented
          </p>
        </div>

        <div className="flex flex-row justify-center flex-wrap items-center">
          <button
            onClick={handleRegister}
            className="p-4 text-sm bg-lime-500 text-white rounded-md px-10 font-semibold my-6 hover:bg-lime-600"
          >
            JOIN THE TALENTS <span className="animate-pulse">❤</span>
          </button>
          {walletInfo?.address ? (
            <div className="p-1 px-6 ml-6 inline-block self-center rounded-3xl border-2 border-lime-500">
              <p className="text-sm text-lime-500 font-semibold justify-center flex flex-row items-center self-center">
                <img src={anchorImage} alt="🔹" className="mr-1" />
                {walletInfo.networkName}
              </p>
              <p className="text-white">{formatAddress(walletInfo.address)}</p>
            </div>
          ) : (
            <button
              onClick={connectToMetamask}
              className="p-4 text-sm bg-orange-500 text-white rounded-md lg:ml-6 px-10 font-semibold hover:bg-orange-600"
            >
              CONNECT WALLET <span className="animate-pulse">🔗</span>
            </button>
          )}
        </div>
      </header>

      <main>
        {signupFormVisible ? (
          <Form
            address={walletInfo?.address!}
            onClose={() => setSignupFormVisible(false)}
            walletConnector={connectToMetamask}
          />
        ) : (
          <>
            <h5 className="text-left text-2xl font-semibold m-6">
              Talented Devs ❤❤
            </h5>
            <div className="flex flex-row flex-wrap justify-around pt-6">
              {developers === false ? (
                <div>
                  <h4 className="text-md text-xl font-semibold">
                    An error occurred.
                    <br /> We couldn't connect to our backend. Make sure you
                    have internet access and try again
                  </h4>
                  <button
                    onClick={fetchDevs}
                    className="p-2 px-8 mt-4 hover:bg-lime-600 bg-lime-500 text-white font-semibold rounded-lg"
                  >
                    Try again
                  </button>
                </div>
              ) : developers.length === 0 ? (
                <div>
                  <h2 className="text-2xl font-semibold">
                    🤷‍♂️🤷‍♀️
                    <br />
                    Looks like you're too early
                  </h2>
                  <p className="text-lg">
                    There's no registered developer at the moment. Be the first
                    to register or come back later
                  </p>
                </div>
              ) : (
                developers.map((developer) => (
                  <Developer {...developer} key={developer.username} />
                ))
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
