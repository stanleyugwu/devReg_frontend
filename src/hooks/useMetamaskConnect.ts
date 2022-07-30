import React, { useCallback, useEffect, useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from "ethers";

type WalletConnectionInfo = Record<"networkName" | "address", string>;
function useMetamaskConnect() {
  const [connectionInfo, setConnectionInfo] = useState<WalletConnectionInfo>();
  const [hasMetamask, setHasMetamask] = useState(true);
  // globally provisioned ethers provider
  const [provider, setProvider] = useState<ethers.providers.Web3Provider>();

  // Attaches listeners to metamask
  const addProviderListeners = useCallback(() => {
    window.ethereum.on("accountsChanged", async function (accounts: any) {
      // Time to reload your interface with accounts[0]!
      setConnectionInfo({
        networkName: (await provider?.getNetwork())?.name.toUpperCase() || "",
        address: accounts[0] as string,
      });
    });
    
    window.ethereum.on("chainChanged", () => {
      window.location.reload();
    });
  }, [provider]);

  // detect wallet connection
  const checkPreviousWalletConnection = React.useCallback(async () => {
    // check if account is connected. If not we fail silently and
    // allow user to manually trigger connection by clicking on "connect wallet button"
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });
    if (accounts.length) {
      // connected before, lets set connection state
      setConnectionInfo({
        networkName: (await provider?.getNetwork())?.name.toUpperCase() || "",
        address: accounts[0] as string,
      });
      // connection made,lets add listeners to provider
      addProviderListeners();
    }
  }, [provider, addProviderListeners]);

  // Will listen for when provider is set so to call checker function
  // probably after mount effect runs
  useEffect(() => {
    // now lets try wallet connection
    checkPreviousWalletConnection();
  }, [provider, checkPreviousWalletConnection]);

  // Ran on mount, initialises metamask
  useEffect(() => {
    (async () => {
      // this returns the provider, or null if it wasn't detected
      const detectedProvider = await detectEthereumProvider();

      // assert metamask is installed, returns early otherwise
      if (!detectedProvider || !window.ethereum) {
        setHasMetamask(false);
        return;
      }

      // since metamask is installed, let's create global provider
      setProvider(
        new ethers.providers.Web3Provider(
          detectedProvider as ethers.providers.ExternalProvider
        )
      );
    })();

    return () => {
      provider?.removeAllListeners("accountsChanged");
      provider?.removeAllListeners("chainChanged");
    };
  }, []);

  // connection to metamask triggered by button click
  const connectWallet = React.useCallback(async () => {
    // which is where our contract is deployed to
    try {
      // get the first account
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      // set the detected connection
      const firstAcct = accounts[0] as string;
      setConnectionInfo({
        networkName: (await provider?.getNetwork())?.name.toUpperCase() || "",
        address: firstAcct,
      });

      // add listeners
    } catch (error) {
      // @ts-ignore
      console.log(error.message);
    }
  }, [provider]);

  return {
    walletInfo: connectionInfo,
    metamaskInstalled: hasMetamask,
    ethersProvider: provider,
    connectToMetamask: connectWallet,
  };
}

export default useMetamaskConnect;
