import { ethers } from "ethers";
import DevRegAbi from "../abis/DevReg.json";
import contract from "../constants/contract";

export type CallReturn = {
  /**
   * Determines whether the call returned a receipt (for transaction), or value (message call)
   * Either case, it means the execution has succeeded
   */
  isReceipt: boolean;
  /**
   * This will be the actual receipt or value depending on the value of `isReceipt` key
   */
  value: ethers.ContractReceipt | any;
};

// check whether the passed argument is a transaction object
const isTransaction = (tx: any): boolean =>
  tx instanceof Object && tx.hash && tx.wait;

/**
 * This utility helps interace with the devReg contract in an easy way.
 * You pass it a signer, and it'll return an interface that corresponds with devReg contract
 * from which you can call it's functions from. All calls will be made via the signer.
 * This util will handle capturing functions revert reasons and reporting success/error states
 */
const devRegInterface = (signer: ethers.Signer | ethers.providers.Provider) => {
  // lets instantiate our contract and call register function
  let contractAbi: ethers.ContractInterface = DevRegAbi;
  const devReg = new ethers.Contract(
    contract.CONTRACT_ADDRESS,
    contractAbi,
    signer
  );

  return {
    /**
     * It will be used for invoking the contract functions but it will also handle
     * and normalise errors and returned values
     */
    async call(functionName: string, ...args: any[]): Promise<CallReturn> {
      try {
        await devReg.callStatic[functionName](...args);
        // mock call didnt fail, let's now execute function as tx
        const tx: ethers.ContractTransaction = await devReg[functionName](
          ...args
        );

        // if the function called is read-only, tx will have the returned value of that function
        // if it's not read-only, tx will be a transaction object. We check for these scenarios
        if (isTransaction(tx)) {
          // tx is transaction, lets wait for the receipt
          const receipt: ethers.ContractReceipt = await tx.wait();
          return { isReceipt: true, value: receipt };
        } else {
          return { isReceipt: false, value: tx };
        }
      } catch (error: any) {
        // let's check if thrown error is as result of revert or transaction error
        // and just rethrow, but attach a key which indicates whether error is caused by
        // called function or the transaction
        throw { ...error, reason: error.reason || error.message };
      }
    },
    ...devReg,
  };
};

export default devRegInterface;
