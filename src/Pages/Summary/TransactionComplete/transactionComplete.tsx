/* eslint-disable max-len */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Button, Modal, Image } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface TxCompleteModalProps {
  openTxCompleteModal: boolean;
  handleTxCompleteModalClose: () => void;
  directoryIdentifier: string;
  newsetupdatehash: string;
  blockchainName: string;
}
const TransactionComplete: React.FC<TxCompleteModalProps> = ({
  openTxCompleteModal,
  handleTxCompleteModalClose,
  directoryIdentifier,
  newsetupdatehash,
  blockchainName,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(openTxCompleteModal);
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(`/directory/${directoryIdentifier}?status=paid`);
    handleTxCompleteModalClose();
    setIsModalOpen(false);
  };
  const style = {
    borderRadius: "25px",
    backgroundColor: "#FFF8F6",
    color: "black",
  };
  const iconTop = {
    fontWeight: "bold",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };
  const midAmt = {
    padding: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "107px",
    backgroundColor: "#FFF8F6",
    fontSize: "14px",
    color: "black",
    left: "592.29px",
    top: "429.87px",
  };

  return (
    // eslint-disable-next-line react/jsx-filename-extension
    <>
      <Modal
        title={"Transaction details"}
        open={isModalOpen}
        onCancel={handleCancel}
        style={style}
        visible={false}
        footer={[
          <Button
            key="back"
            style={{
              display: "flex",
              justifyContent: "center",
              width: "40%",
              border: "1px solid black",
              borderRadius: "5px",
              left: "30%",
            }}
            size={"large"}
            onClick={handleCancel}
          >
            OK
          </Button>,
        ]}
      >
        <div>
          <p style={iconTop}>
            {" "}
            <Image
              src={"/assets/images/Successsful.svg"}
              alt="pic"
              preview={false}
            />
            <span style={{ paddingLeft: "1.5%" }}>
              Transaction Initiated successfully
            </span>
          </p>
          <div style={midAmt}>
            <p>
              Your payment is being processed <br /> You can check Etherscan to
              get more information
            </p>
          </div>
          <hr />

          <p style={{ textAlign: "center", fontWeight: "bold" }}>
            <a
              href={`https://${blockchainName}.etherscan.io/tx/${newsetupdatehash}`}
              target="_blank"
              rel="noreferrer"
            >
              View on Etherscan{" "}
            </a>
          </p>
        </div>
      </Modal>
    </>
  );
};

export default TransactionComplete;
