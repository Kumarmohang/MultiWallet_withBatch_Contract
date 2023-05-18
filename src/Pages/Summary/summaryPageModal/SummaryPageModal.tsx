/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Button, Modal, Image, Typography, Spin, Alert } from "antd";
import React, { ReactElement, useEffect, useState } from "react";
// import {
//   ApproveERC,
//   batchTransaction,
//   getBlockNo,
//   getGasFees,
// } from "../../../utils/helper";
import { LoadingOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  initiateTxAction,
  initiateTxApiCall,
  updateTxAction,
  updateTxApiCall,
} from "../logic";
import { AppDispatch, RootState } from "../../../store";
import { ApiState } from "../../../index.d";
import bigDecimal from "js-big-decimal";
// import ERC20_ABI from "../../../ABI/ERC20abi.json";
// import BATCH_ABI from "../../../ABI/BatchContract.json";

interface SummaryPageModalProps {
  openSummaryModal: boolean;
  handleSummaryModalClose: () => void;
  publicAddress: string;
  totalTokens: number;
  receipientAddresses: string[];
  receipientAmounts: string[];
  invoiceIds: string[];
  updateStatusToPaid: () => void;
  handleTxCompleteModalOpen: () => void;
  setUpdateHash: (hash: string) => void;
  token: any;
  ERC20Contract: string;
}

const SummaryPageModal: React.FC<SummaryPageModalProps> = ({
  handleSummaryModalClose,
  openSummaryModal,
  publicAddress,
  totalTokens,
  receipientAddresses,
  receipientAmounts,
  invoiceIds,
  updateStatusToPaid,
  handleTxCompleteModalOpen,
  setUpdateHash,
  token,
  ERC20Contract,
}) => {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  const { Text } = Typography;
  const [isModalOpen, setIsModalOpen] = useState(openSummaryModal);
  const [approveTxHash, setApproveTxHash] = useState("");
  const [paymentTxHash, setPaymentTxHash] = useState("");
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [approveTxStatus, setApproveStatus] = useState("");
  const [paymentTxStatus, setPaymentStatus] = useState("");
  const [approvalEstimatedPrice, setApprovalEstimatedPrice] = useState(0);
  const [paymentEstimatedPrice, setPaymentEstimatedPrice] = useState(0);
  const [approvalBlockNo, setApprovalBlockNo] = useState("");
  const [paymentBlockNo, setPaymentBlockNo] = useState("");
  const dispatch: AppDispatch = useDispatch();
  const initiateTxState: ApiState = useSelector(
    (state: RootState) => state.initiateTxData
  );
  const updateTxState: ApiState = useSelector(
    (state: RootState) => state.updateTxData
  );
  const blockchainConfigData: any = useSelector(
    (state: RootState) => state.blockchainConfigData
  );
  const {
    ERC20ABI,
    abi: BATCH_ABI,
    contractAddress: spenderAddress,
  } = blockchainConfigData.data &&
  blockchainConfigData.data.data.UtilityContracts[0];

  const initiateTxData: any = initiateTxState?.data;
  const updateTxData: any = updateTxState?.data;
  const [paymentLoading, setPaymentLoading] = useState(false);

  const loadingCondition = paymentLoading ? "Payment" : "Approval";
  let transactionHash: string;
  const approvePayment = async () => {
    let gasFee;
    let blockNo;
    let status;

    try {
      // transactionHash = await ApproveERC(totalTokens.toString());
      transactionHash = await token.approveERC(
        spenderAddress,
        ERC20ABI,
        totalTokens.toString()
      );
      gasFee = await token.gasFees(transactionHash);

      blockNo = await token.getBlockNo(transactionHash);

      status = await token.getStatus(transactionHash);

      setApproveTxHash(transactionHash);
      status ? setApproveStatus("success") : setApproveStatus("failed");
    } catch (err: any) {
      console.log({ err });
      if (/^0x([A-Fa-f0-9]{64})$/.test(err)) {
        gasFee = await token.gasFees(transactionHash);
        blockNo = await token.getBlockNo(transactionHash);
        setApproveTxHash(transactionHash);
      } else {
        gasFee = 0;
        blockNo = "";
        setApproveTxHash("");
      }
      setApproveStatus("failed");
    }
    setApprovalEstimatedPrice(gasFee);
    setApprovalBlockNo(blockNo);
  };

  useEffect(() => {
    dispatch(initiateTxAction.resetInitiateTxState());
    dispatch(updateTxAction.resetUpdateTxState());
  }, []);
  const proceedPayment = async () => {
    let gasFee;
    let blockNo;
    let status;
    receipientAmounts = receipientAmounts.map((amount) =>
      new bigDecimal(amount).getValue()
    );
    try {
      transactionHash = await token.batchPayment(
        receipientAddresses,
        receipientAmounts,
        ERC20Contract,
        spenderAddress,
        BATCH_ABI
      );

      gasFee = await token.gasFees(transactionHash);

      status = await token.getStatus(transactionHash);

      blockNo = await token.getBlockNo(transactionHash);

      setPaymentTxHash(transactionHash);
      setUpdateHash(transactionHash);
      status ? setPaymentStatus("success") : setPaymentStatus("failed");
    } catch (error: any) {
      console.log("err", error);
      if (/^0x([A-Fa-f0-9]{64})$/.test(error)) {
        gasFee = await token.gasFees(transactionHash);
        blockNo = await token.getBlockNo(transactionHash);
        setPaymentTxHash(transactionHash);
        setUpdateHash(error);
      } else {
        gasFee = 0;
        blockNo = "";
        setPaymentTxHash("");
      }
      setPaymentStatus("failed");
    }
    setPaymentEstimatedPrice(gasFee);
    setPaymentBlockNo(blockNo);
  };

  useEffect(() => {
    if (
      approveTxStatus !== "" &&
      (approveTxHash !== "" || approveTxStatus === "failed") &&
      initiateTxData?.id
    ) {
      let status = "complete";
      if (approveTxStatus === "failed") {
        status = "failed";
        setApproveStatus("");
      }
      dispatch(
        updateTxApiCall({
          txnHash: approveTxHash,
          txnId: initiateTxData?.id,
          status: status,
          gasFee: approvalEstimatedPrice,
          blockNo: approvalBlockNo.toString(),
        })
      );
      setApprovalLoading(false);
      setApproveTxHash("");
      dispatch(initiateTxAction.resetInitiateTxState());
      dispatch(updateTxAction.resetUpdateTxState());
    }
  }, [
    approvalBlockNo,
    approvalEstimatedPrice,
    approveTxHash,
    approveTxStatus,
    dispatch,
    initiateTxData,
    initiateTxData?.id,
  ]);

  useEffect(() => {
    if (
      paymentTxStatus !== "" &&
      (paymentTxHash !== "" || paymentTxStatus === "failed") &&
      initiateTxData?.id
    ) {
      let status = "complete";
      if (paymentTxStatus == "failed") {
        status = "failed";
        setPaymentStatus("");
      }
      dispatch(
        updateTxApiCall({
          txnHash: paymentTxHash,
          txnId: initiateTxData?.id,
          status: status,
          gasFee: paymentEstimatedPrice,
          blockNo: paymentBlockNo.toString(),
        })
      );
    }
    setPaymentTxHash("");
  }, [
    paymentBlockNo,
    dispatch,
    initiateTxData,
    initiateTxData?.id,
    paymentEstimatedPrice,
    paymentTxHash,
    paymentTxStatus,
  ]);

  useEffect(() => {
    if (updateTxData && updateTxData.type == "payment") {
      setPaymentLoading(false);
      dispatch(initiateTxAction.resetInitiateTxState());
      dispatch(updateTxAction.resetUpdateTxState());
    }
  }, [dispatch, updateTxData]);
  useEffect(() => {
    if (initiateTxData?.id && initiateTxData?.type == "approval") {
      approvePayment();
    }
    if (initiateTxData?.id && initiateTxData?.type == "payment") {
      proceedPayment();
    }
  }, [initiateTxData]);

  useEffect(() => {
    if (paymentTxStatus === "success") {
      updateStatusToPaid();
      handleTxCompleteModalOpen();
      handleSummaryModalClose();
      setIsModalOpen(false);
    }
  }, [
    handleSummaryModalClose,
    handleTxCompleteModalOpen,
    paymentTxStatus,
    updateStatusToPaid,
    updateTxData,
  ]);

  const handleApprove = async () => {
    dispatch(initiateTxAction.resetInitiateTxState());
    dispatch(updateTxAction.resetUpdateTxState());
    setApprovalLoading(true);
    dispatch(
      initiateTxApiCall({
        invoiceIds: invoiceIds,
        type: "approval",
        payerPublicAddress: publicAddress,
      })
    );
  };

  const handleBatchPayment = async () => {
    setPaymentLoading(true);
    dispatch(initiateTxAction.resetInitiateTxState());
    dispatch(updateTxAction.resetUpdateTxState());
    dispatch(
      initiateTxApiCall({
        invoiceIds: invoiceIds,
        type: "payment",
        payerPublicAddress: publicAddress,
      })
    );
  };

  const handleCancel = () => {
    handleSummaryModalClose();
    setIsModalOpen(false);
  };

  function renderButton(): ReactElement<any, any> {
    return approveTxStatus != "success" ? (
      <Button
        key="submit"
        size={"large"}
        style={{ width: "49%", borderRadius: "7px" }}
        onClick={handleApprove}
        type="primary"
      >
        Approve
      </Button>
    ) : (
      <Button
        key="submit"
        size={"large"}
        style={{ width: "49%", borderRadius: "7px" }}
        onClick={handleBatchPayment}
        type="primary"
      >
        Proceed To Pay
      </Button>
    );
  }
  const style = {
    borderRadius: "25px",
  };
  const iconTop = {
    fontWeight: "bold",
  };
  const midAmt = {
    padding: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "107px",
    backgroundColor: "#FFF8F6",
    color: "black",
    fontSize: "20px",
    left: "592.29px",
    top: "429.87px",
  };
  return (
    <>
      <Modal
        title="You are now connected with MetaMask."
        open={isModalOpen}
        onOk={handleApprove}
        onCancel={handleCancel}
        okText="Approve"
        style={style}
        visible={false}
        maskClosable={false}
        footer={[
          !(paymentLoading || approvalLoading) ? (
            <Button
              key="back"
              style={{ width: "49%", border: "none" }}
              size={"large"}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          ) : (
            <>
              <Spin indicator={antIcon} style={{ marginRight: 10 }} />
              <Text style={{ paddingBottom: 40 }}>{loadingCondition}</Text>
            </>
          ),
          !(paymentLoading || approvalLoading) ? (
            renderButton()
          ) : (
            <Text style={{ marginRight: 150, paddingBottom: 40 }}>
              {" "}
              in progress
            </Text>
          ),
        ]}
      >
        <div>
          <p style={iconTop}>
            {" "}
            <Image
              src={"/assets/images/DirectoryIconOrange.svg"}
              alt="pic"
              preview={false}
            />
            You are going to pay
          </p>
          <div style={midAmt}>
            <p
              style={{
                marginTop: "25px",
                fontWeight: "bold",
                fontSize: "25px",
              }}
            >
              {totalTokens}
              <Image
                src={"/assets/images/AMR1.svg"}
                alt="pic"
                preview={false}
                style={{ padding: "10px" }}
              />{" "}
              {token.tokenName}
            </p>
          </div>
          <div style={{ width: "100%" }}>
            <table style={{ width: "100%" }}></table>
          </div>
          <div style={{ padding: "3% 2%" }}>
            <Alert
              style={{ height: "50%" }}
              message={
                approveTxStatus != "success"
                  ? "Kindly approve the transaction using your wallet."
                  : "Approval successful. Kindly initiate the payment and confirm the same in your wallet."
              }
              type="info"
              showIcon
              banner={true}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SummaryPageModal;
