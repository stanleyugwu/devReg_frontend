import React, { useEffect, useState } from "react";
import formatAddress from "../utils/formatWalletAddress";
import anchorImage from "../images/anchor.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useWalletStore from "../store/wallet";
import connectMetamask from "../utils/connectMetamask";

export type MetamaskWarningProps = {
  closeMenu: () => void;
};
// STATIC COMPONENT
const MetamaskWarning = ({ closeMenu }: MetamaskWarningProps) => (
  <div className="absolute bg-dark bg-opacity-50 inset-0 flex flex-col text-center items-center justify-center">
    <div className="rounded-xl p-6 w-11/12 xl:w-7/12 bg-dark text-center flex justify-center items-center flex-col">
      <span
        className="flex self-end mb-4 text-lime-500 text-2xl font-semibold cursor-pointer"
        onClick={closeMenu}
      >
        X
      </span>
      <h2 className="font-semibold text-white text-xl mt-4 mb-6">
        You need to install Metamask extension on your browser to be able to use
        most features of this dApp
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

const Header = () => {
  const { hasMetamask, walletAddress, processing, networkName, initialiser } =
    useWalletStore();
  const [metamaskWarningVisible, setMetamaskWarningVisible] = useState(false);

  // react-router
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // handles when user clicks on register
  const handleRegister = () => {
    if (!hasMetamask) return setMetamaskWarningVisible(true);
    if (!walletAddress) return connectMetamask();
    navigate("/signup");
  };

  // handles connection to metamask
  const handleConnectToMetamask = () => {
    return hasMetamask ? connectMetamask() : setMetamaskWarningVisible(true);
  };

  // we decide to run metamask store initialiser action
  // here on mount but we can also run it anywhere
  useEffect(() => {
    initialiser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header className="p-2 bg-dark flex flex-row justify-around items-center flex-wrap">
      <div>
        {metamaskWarningVisible && (
          <MetamaskWarning closeMenu={() => setMetamaskWarningVisible(false)} />
        )}
        <h1 className="text-white font-[cursive] text-center text-4xl font-semibold">
          {"<DevReg/>"}
        </h1>
        <p className="text-white font-semibold mb-4">
          Developer registry for the talented
        </p>
      </div>

      {processing ? (
        <div className="text-white text-2xl animate-pulse p-6">❤ ❤ ❤</div>
      ) : (
        <div className="flex flex-row justify-center flex-wrap items-center">
          {pathname === "/" ? (
            <button
              onClick={handleRegister}
              className="button text-sm my-2 lg:my-6 hover:bg-lime-600"
            >
              <span className="animate-pulse">❤</span> JOIN THE TALENTS
            </button>
          ) : (
            <Link
              to={"/"}
              className="button text-sm my-2 lg:my-6 hover:bg-lime-600"
            >
              <span className="animate-pulse">🏠</span> GO HOME
            </Link>
          )}
          {walletAddress ? (
            <div className="p-1 px-6 lg:ml-6 inline-block self-center rounded-3xl border-2 border-lime-500">
              <p className="text-sm text-lime-500 font-semibold justify-center flex flex-row items-center self-center">
                <img src={anchorImage} alt="🔹" className="mr-1" />
                {networkName}
              </p>
              <p className="text-white">{formatAddress(walletAddress)}</p>
            </div>
          ) : (
            <button
              onClick={handleConnectToMetamask}
              className="button text-sm !bg-orange-500 lg:ml-6 hover:!bg-orange-600"
            >
              CONNECT WALLET <span className="animate-pulse">🔗</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
