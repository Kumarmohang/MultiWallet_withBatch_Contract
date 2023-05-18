import { useWeb3Modal } from "@web3modal/react";
import { Col } from "antd";
import React, { useEffect, useState } from "react";
import { getProvider } from "@wagmi/core";
import {
  useAccount,
  // useConnect,
  useDisconnect,
} from "wagmi";
// import { InjectedConnector } from "wagmi/connectors/injected";
interface WalletModalProps {
  onWalletConnect: any;
}

const Profile: React.FC<WalletModalProps> = ({ onWalletConnect }) => {
  const {
    // isOpen,
    open,
    // close,
    // setDefaultChain,
  } = useWeb3Modal();

  const { address, isConnected } = useAccount();
  const [flag, setFlag] = useState(false);
  const { disconnect } = useDisconnect();
  const disconnectWallet = (): void => {
    disconnect();
  };

  const openModal = async (): Promise<void> => {
    localStorage.removeItem("wagmi.cache");
    localStorage.removeItem("wagmi.wallet");
    localStorage.removeItem("wagmi.store");
    localStorage.removeItem("W3M_VERSION");

    disconnectWallet();
    // Open modal
    // interface Options {
    //   route?: "Account" | "ConnectWallet" | "Help" | "SelectNetwork";
    // }
    await open({ route: "SelectNetwork" });
    setFlag(true);
  };
  const provider = getProvider();
  console.log("provider is ", provider);

  useEffect(() => {
    isConnected && address && flag && onWalletConnect(address);
  }, [address, flag]);

  return (
    <Col span={6} className="approve-modal-btn" onClick={openModal}>
      <strong>Proceed to Pay</strong>
    </Col>
  );
};
export default Profile;
