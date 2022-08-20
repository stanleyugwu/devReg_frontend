import useWalletStore from "../../store/wallet";
import { CustomWindow } from "../../global";
import { ethers } from "ethers";
import getWalletBalance from "./getWalletBalance";
import createSignerFromAddress from "./createSignerFromAddress";
import getNetworkName from "./getNetworkName";
import contract from "../constants/contract";

//extend window
declare let window: CustomWindow;

/**
 * Prompts connection to metamask and to specified NETWORK_ID's network
 */
const connectMetamask = async () => {
  const { hasMetamask, processing, updateStore, walletAddress } =
    useWalletStore.getState();

  // no metamask, no connection
  if (!hasMetamask && !processing) return;
  updateStore({ processing: true });

  try {
    // first request user swicthes to pre-set network. Will throw if user refuses to switch
    if (window.ethereum.networkVersion !== `${contract.NETWORK_ID}`) {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params:   [{ chainId: ethers.utils.hexValue(contract.NETWORK_ID) }],
      });
    }

    // get wallet accounts
    const accounts: string[] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (!accounts.length) return;

    // set the detected connection
    const metamaskProvider = new ethers.providers.Web3Provider(
      window.ethereum,
      contract.NETWORK_ID
    );
    updateStore({
      signer: metamaskProvider.getSigner(accounts[0]),
      networkName: getNetworkName(contract.NETWORK_ID).toUpperCase(),
      walletAddress: accounts[0],
    });

    // fetch wallet account balance async
    getWalletBalance(accounts[0]);

    // connection made,lets add listeners to metamask
    window.ethereum.on("accountsChanged", (accounts: string[]) => {
      if (walletAddress) {
        updateStore({
          walletAddress: accounts[0],
          balance: undefined,
          signer: createSignerFromAddress(accounts[0]),
        });
        getWalletBalance(accounts[0]);
      }
    });
    window.ethereum.on("chainChanged", () => {
      if (walletAddress) {
        updateStore({
          balance: undefined,
          networkName: undefined,
          signer: undefined,
          walletAddress: undefined,
        });
        window.location.reload();
      }
    });
  } catch (error) {
    console.log(error);
  } finally {
    updateStore({ processing: false });
  }
};

export default connectMetamask;