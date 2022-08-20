import { ethers } from "ethers";
import type { CustomWindow } from "../../global";
import useWalletStore from "../../store/wallet";
import contract from "../constants/contract";

//extend window
declare let window: CustomWindow;

/**
 * Fetches the account balance of the provided wallet addres on specified (NETWORK_ID) network
 * asynchronously and updates wallet store balance with result.
 * Note: Fails silently
 */
const getWalletBalance = async (address: string) => {
  const updateStore = useWalletStore.getState().updateStore;
  const metamaskProvider = new ethers.providers.Web3Provider(
    window.ethereum,
    contract.NETWORK_ID
  );

  try {
    const bigNum = await metamaskProvider.getBalance(address);
    const balInEth = ethers.utils.formatEther(bigNum);
    updateStore({
      balance: balInEth.length > 6 ? balInEth.slice(0, 6) + "..." : balInEth,
    });
  } catch (error) {
    console.log("BALANCE RETRIEVAL FAILED");
    // we do nothing
  }
};

export default getWalletBalance;
