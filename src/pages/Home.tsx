import React, { useEffect, useState } from "react";
import "../App.css";
import Developer from "../components/Developer";
import { ethers } from "ethers";
import type { DeveloperInfo } from "../types";
import devRegInterface from "../utils/devRegInterface";

const StaticLoader = (
  <div className="flex flex-col text-center items-center justify-center mt-10">
    <p className="text-4xl text-dark animate-bounce">❤ ❤ ❤</p>
    <h1 className="font-semibold text-xl mt-2">Loading Please Wait...</h1>
  </div>
);

/**
 * Filters array of fetched developers, removing empty datasets
 */
export const filterFetchedDevs = (devs: DeveloperInfo[]) =>
  devs.filter((dev) => dev.username.length);

const Home = () => {
  // one state variable for three states:
  // undefined = loading, [] = no devs, false = error, [data] = fetched data
  const [developers, setDevelopers] = useState<
    DeveloperInfo[] | undefined | false
  >(undefined);

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

      // get all registered devs
      const devs = await devRegInterface(goerliProvider).call("getAllDevs");
      setDevelopers(filterFetchedDevs(devs.value));
    } catch (error: any) {
      console.log("ERROR FETCHING DEVS");
      console.log(error.reason);
      setDevelopers(false);
    }
  };

  useEffect(() => {
    fetchDevs();
  }, []);

  return (
    <div className="App h-full w-full">
      <main>
        <div className="flex flex-row flex-wrap justify-around pt-6">
          {developers === undefined ? (
            StaticLoader
          ) : developers === false ? (
            <div className="mt-10">
              <h4 className="text-md text-xl font-semibold">
                An error occurred.
                <br /> We couldn't connect to our backend. Make sure you have
                internet access and try again
              </h4>
              <button
                onClick={fetchDevs}
                className="p-2 px-8 mt-4 hover:bg-lime-600 bg-lime-500 text-white font-semibold rounded-lg"
              >
                Try again
              </button>
            </div>
          ) : developers.length === 0 ? (
            <div className="mt-10">
              <h2 className="text-2xl font-semibold">
                🤷‍♂️🤷‍♀️
                <br />
                Looks like you're too early
              </h2>
              <p className="text-lg">
                There's no registered developer at the moment. Be the first to
                register or come back later
              </p>
            </div>
          ) : (
            developers.map((developer) => (
              <Developer {...developer} key={developer.username} />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
