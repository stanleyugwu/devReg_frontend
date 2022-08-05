import React, { useCallback, useEffect, useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from "ethers";

type WalletConnectionInfo = Record<"networkName" | "address", string>;
const activeNetwork = () =>
  ethers.providers
    .getNetwork(parseInt((window.ethereum as any)?.networkVersion))
    .name.toUpperCase();
function useMetamaskConnect() {
  const [connectionInfo, setConnectionInfo] = useState<WalletConnectionInfo>();
  const [hasMetamask, setHasMetamask] = useState(false);
  // checking for metamask or connecting to wallet or
  // checking for previous connection
  const [processing, setProcessing] = useState(true);

  // Attaches listeners to metamask
  // we decalre below two listeners outside of addProviderListeners usecallBack
  // so we can cancel the listener from useEffect return
  const handleAccountChanged = (accounts: string[]) => {
    console.log("ACCT");

    setConnectionInfo({
      networkName: activeNetwork(),
      address: accounts[0],
    });
  };
  const handleChainChanged = (chainId: any) => {
    console.log("CHAIN");

    window.location.reload();
  };
  const addProviderListeners = useCallback(() => {
    (window.ethereum as any)?.on("accountsChanged", handleAccountChanged);
    (window.ethereum as any)?.on("chainChanged", handleChainChanged);
  }, []);

  // detect wallet connection
  const checkPreviousWalletConnection = React.useCallback(async () => {
    // check if account is connected. If not we fail silently and
    // allow user to manually trigger connection by clicking on "connect wallet button"
    const accounts = await (window.ethereum as any).request({
      method: "eth_accounts",
    });
    if (accounts.length) {
      // connected before, lets set connection state
      setConnectionInfo({
        networkName: activeNetwork(),
        address: accounts[0] as string,
      });
      // connection made,lets add listeners to provider
      addProviderListeners();
    }
    setProcessing(false);
  }, [addProviderListeners]);

  // Ran on mount, initialises metamask
  useEffect(() => {
    (async () => {
      try {
        // this returns the provider, or null if it wasn't detected
        const detectedProvider = await detectEthereumProvider({
          mustBeMetaMask: true,
        });

        // assert metamask is installed
        if (!!detectedProvider && !!(window.ethereum as any)) {
          setHasMetamask(true);
          checkPreviousWalletConnection();
        } else setProcessing(false);
      } catch (error) {
        // metamask detection failure
        setProcessing(false);
      }
    })();

    return () => {
      // TODO: Properly add and remove event handlers
      if (hasMetamask && !processing) {
        (window.ethereum as any).removeListener(
          "accountsChanged",
          handleAccountChanged
        );
        (window.ethereum as any).removeListener(
          "chainChanged",
          handleChainChanged
        );
      }
    };
  }, []);

  // connection to metamask triggered by button click
  const connectWallet = React.useCallback(async () => {
    // no metamask, no connection
    if (!hasMetamask && !processing) return null;
    setProcessing(true);

    // which is where our contract is deployed to
    try {
      // get the first account
      const accounts = await (window.ethereum as any).request({
        method: "eth_requestAccounts",
      });

      // set the detected connection
      const firstAcct = accounts[0] as string;
      setConnectionInfo({
        networkName: activeNetwork(),
        address: firstAcct,
      });

      // add listeners
    } catch (error) {
      // @ts-ignore
      console.log(error.message);
    } finally {
      setProcessing(false);
    }
  }, [hasMetamask, processing]);

  return {
    walletInfo: connectionInfo,
    metamaskInstalled: hasMetamask,
    connectToMetamask: connectWallet,
    processing,
  };
}

export default useMetamaskConnect;
