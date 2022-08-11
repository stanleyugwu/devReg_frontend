import { ethers } from "ethers";
import useWalletStore from "../store/wallet";
import { CustomWindow } from "../types";

//extend window
declare let window: CustomWindow;

/**
 * Fetches the accoutn balance of the provided wallet addres on Goerli testnet
 * asynchronously and updates wallet store balance with result.
 * Note: Fails silently
 */
const getWalletBalance = async (address: string) => {
  const updateStore = useWalletStore.getState().updateStore;
  const metamaskProvider = new ethers.providers.Web3Provider(
    window.ethereum,
    5
  );

  try {
    const balInEth = ethers.utils.formatEther(
      await metamaskProvider.getBalance(address)
    );
    updateStore({ balance: balInEth });
  } catch (error) {
    console.log("BALANCE RETRIEVAL FAILED");
    // we do nothing
  }
};

export default getWalletBalance;
