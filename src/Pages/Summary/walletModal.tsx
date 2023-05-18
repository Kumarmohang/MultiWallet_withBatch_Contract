// import { Col } from "antd";
import React from "react";

import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import Profile from "./Profile";

import {
  arbitrum,
  avalanche,
  bsc,
  fantom,
  gnosis,
  mainnet,
  optimism,
  polygon,
  bscTestnet,
  hardhat,
  polygonMumbai,
  sepolia,
  zkSync,
  zkSyncTestnet,
  arbitrumGoerli,
  goerli,
} from "wagmi/chains";

const chains = [
  arbitrum,
  avalanche,
  bsc,
  fantom,
  gnosis,
  mainnet,
  optimism,
  polygon,
  bscTestnet,
  hardhat,
  polygonMumbai,
  sepolia,
  zkSync,
  zkSyncTestnet,
  arbitrumGoerli,
  goerli,
];

// const projectId = "6f3fecf13270f680e07b34ac73092aa6";
const projectId: any = process.env.REACT_APP_PROJECT_ID;
interface WalletModalProps {
  // onWalletSelect: (walletAddress: string) => void;
  handleWalletClose: () => void;
  openWalletModal: boolean;
  onWalletConnect: any;
}
const WalletModal: React.FC<WalletModalProps> = ({
  // handleWalletClose,
  // openWalletModal,
  onWalletConnect,
}) => {
  const { provider } = configureChains(chains, [w3mProvider({ projectId })]);
  const wagmiClient = createClient({
    autoConnect: true,
    connectors: w3mConnectors({ projectId, version: 1, chains }),
    provider,
  });

  const ethereumClient = new EthereumClient(wagmiClient, chains);

  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <Profile onWalletConnect={onWalletConnect} />
      </WagmiConfig>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  );
};

export default WalletModal;
