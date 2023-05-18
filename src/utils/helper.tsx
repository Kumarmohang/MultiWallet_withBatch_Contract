/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prettier/prettier */
import { ethers } from "ethers";
import ERC20_ABI from "../ABI/ERC20abi.json";

import BATCH_ABI from "../ABI/batch_abi.json";

let contract: any;
let signer: any;
let provider: any;

const BatchContract: any = process.env.REACT_APP_BATCH_SMART_CONTRACT;
const ERC20Contract: any = process.env.REACT_APP_ERC20_SMART_CONTRACT;
const RedirectPage = () => {
  window.open("https://metamask.io/", "_blank");
};

/**
 * connectToMetamask() is used to connect the metask and udpate the @signer variable .
 * by using this @signer variable we can create a contract object for ERC20 or Amrit smart contract .
 */

async function connectToMetamask(): Promise<any> {
  if (typeof (window as any).ethereum !== "undefined") {
    provider = new ethers.providers.Web3Provider((window as any).ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    return signer.getAddress();
  } else {
    window.alert("kindly install MetaMask on your Browner");
    RedirectPage();
  }
}

/**
 * @description erc20smartcontract() function is used to get the object for ERC20 or Amrit smart contract .
 * by using thie contract object we call approve() function in ERC20 or Amrit smart contract .
 * @param {String} erc20address
 */
async function erc20SmartContract(): Promise<void> {
  contract = new ethers.Contract(ERC20Contract, ERC20_ABI, signer);
  return contract;
}

/**
 * @description erc20smartcontract() function is used to get the object for ERC20 or Amrit smart contract .
 * by using thie contract object we call approve() function in ERC20 or Amrit smart contract .
 * @param {String} erc20address
 */
async function batchSmartContract(): Promise<any> {
  // provider = new ethers.providers.Web3Provider((window as any).ethereum);
  // await provider.send("eth_requestAccounts", []);
  // signer = provider.getSigner();
  contract = new ethers.Contract(BatchContract, BATCH_ABI, signer);
  return contract;
}

/**
 * @description the purpose of ApproveERC() function is to maintain the status of the batch transaction .
 * it will call the approve() function and wait the transaction hash.
 * it will update the status of the transaction whether it got failed or completed successfully .
 * @param {String} spenderAddress
 * @param {String} spenderAmount
 * @returns
 */

async function ApproveERC(spenderAmount: string): Promise<string> {
  let TransactionResults: any;
  try {
    TransactionResults = await approve(BatchContract, spenderAmount);
    const hash = TransactionResults.hash;
    await TransactionResults.wait();
    return hash;
  } catch (error) {
    console.log("Approve failed Hash is here", TransactionResults.hash);
    throw TransactionResults?.hash;
  }
}

/**
 * @description approve() function will trigger when the user approve the invoices .
 * with the help of smart contract object it will call the approve() function in ERC20 or Amrit smart contract .
 * and it will also return transaction details /hash.
 * @param spenderAddress
 * @param spenderAmount
 * @returns
 */
async function approve(
  spenderAddress: string,
  spenderAmount: string
): Promise<any> {
  await erc20SmartContract();

  return contract.approve(
    spenderAddress,
    ethers.utils.parseEther(spenderAmount)
  );
}

/**
 * @description batchTransaction() function will connect Metamask , if Metamask was not connected .
 * it creates BatchContract object using @batchContractAddress ,@BATCH_ABI AND @signer .
 * by using BatchContract object it will call the batchTransfer() in batch smart contract .
 * and it will return the transaction hash to batch() function.
 * @param  {String} batchContractAddress  is address of the Batch smart contract .
 * @param {String} contractERC20address  is Amrit or ERC20 smart contract address.
 * @param {String} txReceiveraddressString Receiver address.
 * @param {String} stringamount Receiver Amount.
 * @returns the Hash of the transactions.
 */
async function batchTransaction(
  txReceiveraddressString: string[],
  stringamount: string[]
): Promise<any> {
  let BatchtransactionResult: any;
  try {
    await batchSmartContract();
    const contractAddress = await batchSmartContract();
    const amounts: any = stringamount.map((elem) =>
      ethers.utils.parseEther(elem)
    );
    BatchtransactionResult = await contractAddress.batchTransferToken(
      ERC20Contract,
      txReceiveraddressString,
      amounts,
      { gasLimit: 4000000 }
    );
    await BatchtransactionResult.wait();
    return BatchtransactionResult.hash;
  } catch (err) {
    console.log("err", err);
    throw BatchtransactionResult?.hash;
  }
}

async function getGasFees(hash: string): Promise<any> {
  const tx = await provider.getTransactionReceipt(hash);
  return ethers.utils.formatEther(tx.gasUsed * tx.effectiveGasPrice);
}

async function getBlockNo(hash: string) {
  const tx = await provider.getTransactionReceipt(hash);
  return tx.blockNumber;
}

export {
  connectToMetamask,
  ApproveERC,
  batchTransaction,
  getGasFees,
  getBlockNo,
};
