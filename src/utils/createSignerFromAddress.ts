import { CustomWindow } from "../types";
import { ethers } from "ethers";
import contract from "../constants/contract";

//extend window
declare let window: CustomWindow;

/**
 * Creates a signer connected to a metamask goerli provider from given wallet address
 */
const createSignerFromAddress = (address: string) => {
  // connected before, lets set connection state
  const metamaskProvider = new ethers.providers.Web3Provider(
    window.ethereum,
    contract.NETWORK_ID
  );
  return metamaskProvider.getSigner(address);
};

export default createSignerFromAddress;
