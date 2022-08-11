import useWalletStore from "../store/wallet";
import { CustomWindow } from "../types";
import { ethers } from "ethers";
import getWalletBalance from "./getWalletBalance";

//extend window
declare let window: CustomWindow;

/**
 * Prompts connection to metamask and to goerli testnet
 */
const connectMetamask = async () => {
  const { hasMetamask, processing, updateStore, walletAddress } =
    useWalletStore.getState();

  // no metamask, no connection
  if (!hasMetamask && !processing) return;
  updateStore({ processing: true });

  try {
    // first request user swicthes to goerli. Will throw if user refuses to switch
    if (window.ethereum.networkVersion !== "5") {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x5" }],
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
      5
    );
    updateStore({
      signer: metamaskProvider.getSigner(accounts[0]),
      networkName: "GOERLI",
      walletAddress: accounts[0],
    });

    // fetch wallet account balance async
    getWalletBalance(accounts[0]);

    // connection made,lets add listeners to metamask
    window.ethereum.on("accountsChanged", (accounts: string[]) => {
      if (walletAddress) {
        updateStore({ walletAddress: accounts[0], balance: undefined });
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
