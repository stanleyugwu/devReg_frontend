import { ethers } from "ethers";
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
