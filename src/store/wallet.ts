import create from "zustand";
import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";
import { CustomWindow } from "../types";
import getWalletBalance from "../utils/getWalletBalance";
import checkPreviousWalletConnection from "../utils/checkPreviousWalletConnection";
import createSignerFromAddress from "../utils/createSignerFromAddress";

//extend window
declare let window: CustomWindow;

/**
 * Wallet store type
 */
type WalletStore = {
  /** Name of the blockchain network user is currently connected to */
  networkName?: string;
  /** User's connected wallet address */
  walletAddress?: string;
  /** The balance of the connected wallet address in Ether*/
  balance?: string;
  /** Whether user has metamask installed */
  hasMetamask: boolean;
  /**
   * Denotes when an operation relaed to metmask is in process
   * e.g checking for previous connected address. This is due to heavy async operations
   * in blockchain. components can depend on this state to show a loading view
   */
  processing: boolean;
  /**
   * A ready-to-use signer from the wallet address connected to metamask provider with
   */
  signer?: ethers.Signer;

  /**
   * A function that handles updating single/multiple states of this wallet store in one call
   */
  updateStore(
    storeState: Partial<Omit<WalletStore, "updateStore" | "initialiser">>
  ): void;

  /**
   * An initialiser function expected to be called once, to initialise metamask connections
   */
  initialiser(): void;
};

const useWalletStore = create<WalletStore>((set, get) => ({
  balance: undefined,
  hasMetamask: false,
  processing: true,
  networkName: undefined,
  signer: undefined,
  walletAddress: undefined,
  updateStore(storeState) {
    // updates state my merging new updates with existing
    set((state) => ({ ...state, ...storeState }));
  },
  async initialiser() {
    try {
      // this returns the provider, or null if it wasn't detected
      const detectedProvider = await detectEthereumProvider({
        mustBeMetaMask: true,
      });

      // assert metamask is installed
      if (detectedProvider) {
        set({ hasMetamask: true });
        const previousConection = await checkPreviousWalletConnection();
        if (previousConection) {
          set(previousConection);
          // retrieve wallet balance async. we won't wait for it
          getWalletBalance(previousConection.walletAddress);

          // connection made,lets add listeners to metamask
          // in each event listener, we only act in the handlers if metmask
          // is connected to our app, so to prevent firing handlers when wallet isn't connected
          window.ethereum.on("accountsChanged", (accounts: string[]) => {
            if (get().walletAddress) {
              set({
                walletAddress: accounts[0],
                balance: undefined,
                signer: createSignerFromAddress(accounts[0]),
              });
              getWalletBalance(accounts[0]);
            }
          });
          window.ethereum.on("chainChanged", () => {
            // when user changes chain it means he changed to something else not the specified network ID.
            // we want to reset connection state and reload app
            if (get().walletAddress) {
              set({
                balance: undefined,
                networkName: undefined,
                signer: undefined,
                walletAddress: undefined,
              });
              window.location.reload();
            }
          });
        }
      } else set({ processing: false });
    } catch (error) {
      // metamask detection failure
      console.log(error);
    } finally {
      set({ processing: false });
    }
  },
}));

export default useWalletStore;
