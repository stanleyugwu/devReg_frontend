import { BigNumber } from "ethers";
/**
 * The data structure of individual developer
 */
export type DeveloperInfo = {
  // Developer's unique username.
  username: string;
  // Developer's title e.g "Fullstack developer"
  title: string;
  // Developer's short bio
  bio: string;
  // Developer's reputation points
  reputationPoints: BigNumber;
  // Whether the developer is open to jobs or employment
  openToWork: boolean;
  // Developer's Github username
  githubUsername: string;
  // Registeration date
  regDate: BigNumber;
  // Link to dev's picture to use as profile pic
  devPicUrl: string;
  // Developer's wallet address
  walletAddress: string;
};

/**
 * We're not passing full developer info to this component, just the username.
 * We'll use the username to retreive the full info from the store
 */
export type DeveloperProps = {
  /**
   * Username of the developer. The username will be used to retreive the developer's info
   * from the store.
   */
  username: string;
};


