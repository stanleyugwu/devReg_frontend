/**
 * Type shims for `window.ethereum`
 */
type RequestArgs = { method: string; params?: any };
export interface CustomWindow extends Window {
  ethereum: {
    isMetamask: boolean;
    networkVersion: string;
    chainId: string;
    enable(): void;
    request(arg: RequestArgs): any;
    selectedAddress: null | string;
    send(): null | void;
    sendAsync(): void;
    on(event: string, handler: Function): any;
    removeListener(event: string, handler: Function): any;
  };
}

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
  reputationPoints: number;
  // Whether the developer is open to jobs or employment
  openToWork: boolean;
  // Developer's Github username
  githubUsername: string;
  // Registeration date
  regDate: number;
  // Link to dev's picture to use as profile pic
  devPicUrl: string;
  // Developer's wallet address
  walletAddress: string;
};

// Sign up page form fields
export type SignupFormFields = {
  username: string;
  title: string;
  bio: string;
  openToWork: boolean;
  githubUsername: string;
  devPicUrl: string;
};
