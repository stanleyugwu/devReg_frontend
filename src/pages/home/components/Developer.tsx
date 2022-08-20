import React, { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faCalendar,
  faSpinner,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import github from "./images/github.svg";
import devRegInterface from "../../../utils/services/devRegInterface";
import useWalletStore from "../../../store/wallet";
import Swal from "sweetalert";
import useAppStore from "../../../store";
import { DeveloperInfo, DeveloperProps } from "./types";
import connectMetamask from "../../../utils/services/connectMetamask";

/**
 * Renders a UI card for each registered developer.
 * Retrieves each developer's info from passed `username` parameter
 */
function Developer({ username }: DeveloperProps) {
  const {
    walletAddress: address,
    processing,
    signer,
    balance,
  } = useWalletStore();
  const updateInfo = useAppStore.getState().updateDeveloperInfo;
  // we pick the dev from store via passed username cus we'll be needing some
  // properties of the dev info for updates.
  // we're sure developers state exists cus this component will be rendered by Home which
  // makes sure developers was fetched
  const dev = useAppStore(
    (state) =>
      (state.developers as DeveloperInfo[]).find(
        (dev) => dev.username === username
      ),
    (prev, next) => JSON.stringify(prev) === JSON.stringify(next)
  );

  const navigate = useNavigate();
  const [isGivingRep, setIsGivingRep] = useState(false);

  // handles when user click on a dev info card
  const handleViewMoreInfo = () => {
    navigate(`/${username}`);
  };

  // handles when user wants to give reps
  const handleGiveRep = useCallback(async () => {
    // assert wallet is connected
    if (!address && !processing) {
      setIsGivingRep(false);
      return connectMetamask();
    }

    // wallet connected
    try {
      // check if user's balance is up to 10 wei cus 10 wei
      // has to be sent to give reps
      if (balance && balance === "0.0") {
        // let's throw custom error to be caught in our catch
        // eslint-disable-next-line no-throw-literal
        throw {
          reason: `Insufficient fund. You need to have at least 10 Wei to give reputations. You might want to connect to another wallet which has enough funds`,
        };
      }

      const devReg = devRegInterface(signer!);
      await devReg.call({
        functionName: "giveReputation",
        functionArgs: [username, { gasLimit: 500_000, value: 10 }],
      });

      // everything worked
      // if we can't find the user we gave reps to from store,
      // then something is wrong. We'll reload app to refresh store
      if (!dev) return window.location.reload();

      // lets update dev info state locally instead of reloading app to reflect changes
      const newRepPt = dev.reputationPoints.add(1);
      updateInfo(username, {
        reputationPoints: newRepPt,
      });

      Swal({
        icon: "success",
        title: "Reputation Given",
        text: `You have successfully given reputation to ${username}`,
        timer: 3000,
      });
      setIsGivingRep(false);
      // done
    } catch (error: any) {
      console.log(error);
      setIsGivingRep(false);
      Swal({
        icon: "error",
        title: "Request failed",
        text:
          error.code?.toString?.() === "4001"
            ? "You have to confirm the transaction in the metamask modal that pops up"
            : error.reason,
        timer: 5000,
      });
    }
  }, [address, signer, processing, username, balance, dev, updateInfo]);

  // don't do anything if no dev was retreived
  if (!dev) return <div />;

  const {
    devPicUrl,
    githubUsername,
    openToWork,
    regDate,
    reputationPoints,
    title,
  } = dev;

  return (
    <div className="bg-white border border-lime-300 shadow-sm shadow-lime-400 h-max p-0 rounded-2xl min-h-max pb-4 lg:w-1/4 w-11/12 md:w-2/5 m-2">
      <div className="bg-dark px-4 rounded-t-2xl h-1/2 pb-16 rounded-b-3xl">
        {openToWork && (
          <div className="text-xs w-max mx-auto px-4 py-0.5 mb-4 bg-lime-500 font-semibold rounded-b-full text-white uppercase">
            OPEN TO WORK
          </div>
        )}
        <div className="flex flex-row justify-between mb-4 items-center">
          <p>
            <span className="text-2xl text-white font-medium">
              {reputationPoints.toNumber()}
            </span>
            <span className="text-sm text-white font-medium uppercase">
              Rep(s)
            </span>
          </p>
          <span className="font-medium text-sm text-white">
            <Icon icon={faCalendar} className="mr-1" />
            {new Date(regDate.toNumber()).toDateString()}
          </span>
        </div>
      </div>

      <div className="flex justify-center flex-col px-4 h-1/2 -mt-16 items-center">
        <img
          src={devPicUrl}
          onClick={handleViewMoreInfo}
          alt="Developer"
          className="rounded-3xl cursor-pointer w-36 h-36 border-2 border-lime-400"
        />
        <p className="text-xl mt-2 font-bold">{username}</p>
        <p className="text-sm font-semibold uppercase">{title}</p>
        <div className="mt-6 mb-4 w-full flex flex-wrap flex-row items-center justify-center">
          <button
            onClick={(evt) => {
              evt.stopPropagation();
              if (isGivingRep) return;
              setIsGivingRep(true);
              handleGiveRep();
            }}
            className="uppercase p-3 text-sm bg-dark text-white rounded-l-md px-10 font-semibold hover:bg-lime-600"
          >
            {isGivingRep ? (
              <Icon icon={faSpinner} className="fa fa-spin" />
            ) : (
              <span>
                <Icon icon={faStar} /> Give rep
              </span>
            )}
          </button>
          <Link
            to={`http://github.com/${githubUsername}`}
            className="uppercase text-sm border py-[0.30rem] border-dark text-dark rounded-r-md px-6 font-semibold hover:bg-lime-100 hover:text-white"
          >
            <img src={github} className="animate-pulse" alt="github logo" />
          </Link>
        </div>
        <Link
          to={`/${username}`}
          className="uppercase font-semibold text-sm text-dark hover:text-lime-500"
        >
          Full Info
          <Icon icon={faAngleRight} className="ml-2" />
        </Link>
      </div>
    </div>
  );
}

export default React.memo(Developer);
