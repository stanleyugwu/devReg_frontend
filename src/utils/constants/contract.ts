export type ContractInfo = {
  /**
   * The address of the deployed contract to connect to
   */
  CONTRACT_ADDRESS: string;
  /**
   * The network Id of the network to be connected to for interaction with the contract.
   * This will be used to ensure user connects to the proper network
   */
  NETWORK_ID: number;
};

const contract: ContractInfo = {
  CONTRACT_ADDRESS: "0xF32FdE55F8c32037DA67024522904F5299207Aa8",
  NETWORK_ID: 5,
};

export default contract;
