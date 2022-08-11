import { CustomWindow } from "../types";
import { ethers } from "ethers";

//extend window
declare let window: CustomWindow;
/**
 * detects previous metamask wallet connection.
 * resolves to wallet info object if previous connection was detected, and false otherwise
 */
const checkPreviousWalletConnection = async () => {
  // check if account is connected and on goerli network. If not we fail silently and
  // allow user to manually trigger connection by clicking on "connect wallet button"
  const accounts: string[] = await window.ethereum!.request({
    method: "eth_accounts",
  });
  if (accounts.length && window.ethereum.networkVersion === "5") {
    // connected before, lets set connection state
    const metamaskProvider = new ethers.providers.Web3Provider(
      window.ethereum,
      5
    );
    return {
      signer: metamaskProvider.getSigner(accounts[0]),
      networkName: "GOERLI",
      walletAddress: accounts[0],
    };
  }

  return false;
};

export default checkPreviousWalletConnection;
