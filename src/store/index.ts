import create from "zustand";
import { ethers } from "ethers";
import devRegInterface from "../utils/services/devRegInterface";
import { filterFetchedDevs } from "../pages/home/Home";
import { DeveloperInfo } from "../pages/home/components/types";

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
  /**
   * Updates the information of the developer with given username
   * @param username The username of the developer to update info
   * @param update The new info update to apply
   */
  updateDeveloperInfo(
    username: string,
    update: Partial<Omit<DeveloperInfo, "regDate" | "walletAddress">>
  ): void;
};

const useAppStore = create<AppStore>((set, get) => ({
  developers: undefined,
  addDevelopers(newDevs: DeveloperInfo[]) {
    set({ developers: newDevs });
  },
  async fetchDevelopers() {
    // reset developers to undefined i.e loading state whenever this function is called
    get().developers !== undefined && set({ developers: undefined });
    // we wrap everything in try catch so to be able to catch connection error
    try {
      // lets create a fresh goerli provider for making calls to blockchain
      // we dont need a signer or `from address` since this function just sends a message call to our node
      // Alsp we're ot using metamask provider cus user might not have it installed yet
      const goerliProvider = new ethers.providers.JsonRpcProvider(
        "https://rpc.goerli.mudit.blog/",
        5
      );
      // const goerliProvider = new ethers.providers.JsonRpcProvider();

      // get all registered devs
      const devs = await devRegInterface(goerliProvider).call({
        functionName: "getAllDevs"
      });
      
      set({ developers: filterFetchedDevs(devs.value) });
      return devs.value;
    } catch (error: any) {
      console.log("ERROR FETCHING DEVS");
      console.log(error.reason);
      set({ developers: false });
    }
  },
  updateDeveloperInfo(username, updates) {
    // get all devs
    const devs = get().developers;
    if (!devs) return;
    
    // create new devs array
    const newDevs = devs.map((_dev) => {
      if (_dev.username === username) {
        const updated = {
          ..._dev,
          ...updates,
        };
        return updated
      } else return _dev;
    });
    
    set({
      developers: newDevs,
    });
  },
}));

export default useAppStore;
