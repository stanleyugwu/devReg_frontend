import { CustomWindow } from "../types";
import { ethers } from "ethers";

//extend window
declare let window: CustomWindow;

/**
 * Creates a signer connected to a metamask goerli provider from given wallet address
 */
const createSignerFromAddress = (address: string) => {
  // connected before, lets set connection state
  const metamaskProvider = new ethers.providers.Web3Provider(
    window.ethereum,
    5
  );
  return metamaskProvider.getSigner(address);
};

export default createSignerFromAddress;
