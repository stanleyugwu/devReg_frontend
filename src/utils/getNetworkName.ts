import { ethers } from "ethers";

/**
 * Gets the name of a network from it's chain ID
 */
const getNetworkName = (chainId: number) =>
  ethers.providers.getNetwork(chainId).name || "UNKNOWN";

export default getNetworkName;
