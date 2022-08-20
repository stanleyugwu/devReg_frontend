import createSignerFromAddress from "./createSignerFromAddress";
import type { CustomWindow } from "../../global";
import getNetworkName from "./getNetworkName";
import contract from "../constants/contract";

//extend window
declare let window: CustomWindow;
/**
 * detects previous metamask wallet connection.
 * resolves to wallet info object if previous connection was detected, and false otherwise
 */
const checkPreviousWalletConnection = async () => {
  // check if account is connected and on the specified (NETWORK_ID) network. If not we fail silently and
  // allow user to manually trigger connection by clicking on "connect wallet button"
  const accounts: string[] = await window.ethereum!.request({
    method: "eth_accounts",
  });
  if (
    accounts.length &&
    window.ethereum.networkVersion === `${contract.NETWORK_ID}`
  ) {
    return {
      signer: createSignerFromAddress(accounts[0]),
      networkName: getNetworkName(contract.NETWORK_ID).toUpperCase(),
      walletAddress: accounts[0],
    };
  }

  return false;
};

export default checkPreviousWalletConnection;
