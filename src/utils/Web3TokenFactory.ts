import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { BigNumber, Contract, ContractInterface, ethers } from "ethers";
import { TokenDetails, TransactionReceipt } from "../index.d";
import {
  Address,
  getProvider,
  prepareWriteContract,
  writeContract,
} from "@wagmi/core";
// import { getProvider } from "@wagmi/core";

class Token {
  tokenSmartContractAddress: string;
  utilityContracts: string[];
  blockchainName: string;
  chainId: number;
  tokenName: string;
  signer!: JsonRpcSigner;
  provider!: Web3Provider;
  gasFees!: (hash: string) => Promise<any>;
  getBlockNo!: (hash: string) => Promise<number>;
  getStatus!: (hash: string) => Promise<any>;
  batchPayment!: (
    txReceiveraddressString: string[],
    stringamount: string[],
    tokenSmartContractAddress: Contract,
    utilitySmartContract: string,
    utilityContractsAbi: ContractInterface
  ) => Promise<any>;
  approve!: (
    spenderAddress: string,
    abi: ContractInterface,
    spenderAmount: string
  ) => Promise<any>;
  connectWallet!: () => Promise<string | undefined>;
  createContractObj!: (
    contractAddress: string,
    abi: ContractInterface
  ) => Contract;
  approveERC!: (
    spenderAddress: string,
    abi: ContractInterface,
    spenderAmount: string
  ) => Promise<any>;

  constructor(props: TokenDetails, tokenName: string) {
    this.tokenSmartContractAddress = props.tokenSmartContractAddress;
    this.utilityContracts = props.utilityContracts;
    this.blockchainName = props.blockchainName;
    this.chainId = props.chainId;
    this.tokenName = tokenName;
  }
}

const RedirectPage = (): void => {
  window.open("https://metamask.io/", "_blank");
};

class TokenFactory {
  create = (props: TokenDetails, tokenName: string): Token => {
    const token = new Token(props, tokenName);

    token.connectWallet = async (): Promise<string | undefined> => {
      if (typeof (window as any).ethereum !== "undefined") {
        token.provider = new ethers.providers.Web3Provider(
          (window as any).ethereum
        );
        await token.provider.send("eth_requestAccounts", []);
        token.signer = token.provider.getSigner();

        return token.signer.getAddress();
      } else {
        window.alert("kindly install MetaMask on your Browner");
        RedirectPage();
      }
    };

    token.createContractObj = (
      contractAddress: string,
      abi: ContractInterface
    ): Contract => {
      return new ethers.Contract(contractAddress, abi, token.signer);
    };

    token.approveERC = async (
      spenderAddress: string,
      abi: ContractInterface,
      spenderAmount: string
    ) => {
      let TransactionResults: any;
      try {
        TransactionResults = await token.approve(
          spenderAddress,
          abi,
          spenderAmount
        );

        const hash = TransactionResults.hash;
        await TransactionResults.wait();

        return hash;
      } catch (error) {
        console.log("Approve failed", TransactionResults.hash);
        throw TransactionResults?.hash;
      }
    };

    token.approve = async (
      spenderAddress: string,
      ERC_ABI: any,
      spenderAmount: string
    ) => {
      // const contract = token.createContractObj(
      //   token.tokenSmartContractAddress,
      //   abi
      // );
      // return contract.approve(
      //   spenderAddress,
      //   ethers.utils.parseEther(spenderAmount)
      // );

      try {
        const config: any = await prepareWriteContract({
          address: token.tokenSmartContractAddress as Address,
          abi: ERC_ABI,
          functionName: "approve",
          args: [spenderAddress, ethers.utils.parseEther(spenderAmount)],
        });
        const data = await writeContract(config);

        return data;
      } catch (err) {
        console.log({ err });
        throw err;
      }
    };

    token.batchPayment = async (
      txReceiveraddressString: string[],
      stringamount: string[],
      tokenSmartContractAddress: Contract,
      utilitySmartContract: any,
      utilityContractsAbi: any
    ) => {
      let BatchtransactionResult: any;

      // try {
      //   const contractObj = token.createContractObj(
      //     utilitySmartContract,
      //     utilityContractsAbi
      //   );

      //   const amounts: BigNumber[] = stringamount.map((elem) =>
      //     ethers.utils.parseEther(elem)
      //   );

      //   BatchtransactionResult = await contractObj.batchTransferToken(
      //     tokenSmartContractAddress,
      //     txReceiveraddressString,
      //     amounts,
      //     { gasLimit: 4000000 }
      //   );

      //   await BatchtransactionResult.wait();
      //
      //   return BatchtransactionResult.hash;
      // } catch (err) {
      //   throw BatchtransactionResult?.hash;
      // }

      try {
        const amounts: BigNumber[] = stringamount.map((elem) =>
          ethers.utils.parseEther(elem)
        );
        const config = await prepareWriteContract({
          address: utilitySmartContract,
          abi: utilityContractsAbi,
          functionName: "batchTransferToken",
          args: [
            token.tokenSmartContractAddress,
            txReceiveraddressString,
            amounts,
            { gasLimit: 4000000 },
          ],
        });

        BatchtransactionResult = await writeContract(config);
        await BatchtransactionResult.wait();
        return BatchtransactionResult.hash;
      } catch (err) {
        throw BatchtransactionResult?.hash;
      }
    };

    token.gasFees = async (hash: string) => {
      const provider = getProvider();

      const tx: TransactionReceipt = await provider.getTransactionReceipt(hash);

      // return ethers.utils.formatEther(tx.gasUsed * tx.effectiveGasPrice);
      return ethers.utils.formatEther(
        ethers.BigNumber.from(tx.gasUsed).mul(tx.effectiveGasPrice)
      );
    };

    token.getBlockNo = async (hash: string) => {
      const provider = getProvider();

      const tx: TransactionReceipt = await provider.getTransactionReceipt(hash);

      return tx.blockNumber;
    };

    token.getStatus = async (hash: string) => {
      const provider = getProvider();
      const tx: TransactionReceipt = await provider.getTransactionReceipt(hash);
      const status = tx.status;
      return status;
    };

    return token;
  };
}

export default TokenFactory;
