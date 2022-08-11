import createSignerFromAddress from "./createSignerFromAddress";
import type { CustomWindow } from "../types";

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
    return {
      signer: createSignerFromAddress(accounts[0]),
      networkName: "GOERLI",
      walletAddress: accounts[0],
    };
  }

  return false;
};

export default checkPreviousWalletConnection;
