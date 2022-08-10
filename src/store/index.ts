import create from "zustand";
import { DeveloperInfo } from "../types";
import { ethers } from "ethers";
import devRegInterface from "../utils/devRegInterface";
import { filterFetchedDevs } from "../pages/Home";

/**
 * App store type
 */
type AppStore = {
  /** one state variable for three states: */
  /** undefined = loading, [] = no devs, false = error, [data] = fetched data */
  developers: DeveloperInfo[] | undefined | false;
  addDevelopers(newDevs: DeveloperInfo[]): void;
  /**
   * Handles fetching devs on mount
   */
  fetchDevelopers(): Promise<DeveloperInfo[]>;
};

const useAppStore = create<AppStore>((set, get) => ({
  developers: undefined,
  addDevelopers(newDevs: DeveloperInfo[]) {
    set({ developers: newDevs });
  },
  async fetchDevelopers() {
    // reset developers to undefined i.e loading state whenever this function is called
    // get().developers !== undefined && set({ developers: undefined });
    // we wrap everything in try catch so to be able to catch connection error
    try {
      // lets create a fresh goerli provider for making calls to blockchain
      // we dont need a signer or `from address` since this function just sends a message call to our node
      const goerliProvider = new ethers.providers.JsonRpcProvider(
        "https://rpc.goerli.mudit.blog/",
        5
      );

      // get all registered devs
      const devs = await devRegInterface(goerliProvider).call("getAllDevs");
      set({ developers: filterFetchedDevs(devs.value) });
      return devs.value;
    } catch (error: any) {
      console.log("ERROR FETCHING DEVS");
      console.log(error.reason);
      set({ developers: false });
    }
  },
}));

export default useAppStore;
