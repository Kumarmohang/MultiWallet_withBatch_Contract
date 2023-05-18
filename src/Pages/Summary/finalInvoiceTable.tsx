/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, message, Row, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { FinalInvoiceDataType } from "../../index.d";
import WalletModal from "./walletModal";
import { AppDispatch } from "../../store";
import { useDispatch } from "react-redux";
import { ApproveStatusApiCall, walletStateAction } from "./logic";
import { apiFailureAction } from "../../commonApiLogic";
import SummaryPageModal from "./summaryPageModal/SummaryPageModal";
import TransactionComplete from "./TransactionComplete/transactionComplete";
import bigDecimal from "js-big-decimal";
import TokenFactory from "../../utils/Web3TokenFactory";
import { useSelector } from "react-redux";

interface FuncProp {
  invoiceRowData?: any;
  onInvoiceApprove: (arg: boolean) => void;
  status: string;
  directoryId: string;
  directoryIdentifier: string;
}

const FinalInvoiceTable: React.FC<FuncProp> = ({
  invoiceRowData,
  onInvoiceApprove,
  status,
  directoryId,
  directoryIdentifier,
}) => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  // const [approveStatus, setApproveStatus] = useState<approvedStatus>();
  const [openWalletModal, setOpenWalletModal] = useState(false);
  const [openSummaryModal, setOpenSummaryModal] = useState(false);
  const [publicAddress, setPublicAddress] = useState("");
  const [receipientAddresses, setReceipientAddresses] = useState<string[]>([]);
  const [receipientAmounts, setReceipientAmounts] = useState<string[]>([]);
  const [invoiceIds, setInvoiceIds] = useState<string[]>([]);
  const handleWalletClose = (): void => setOpenWalletModal(false);
  // const handleWalletShow = (): void => setOpenWalletModal(true);
  const handleSummaryModalClose = (): void => setOpenSummaryModal(false);
  const handleSummaryModalOpen = (): void => setOpenSummaryModal(true);
  const [totalTokens, setTotalTokens] = useState(0);
  const [openTxCompleteModal, setTxCompleteModal] = useState(false);
  const handleTxCompleteModalOpen = (): void => setTxCompleteModal(true);
  const handleTxCompleteModalClose = (): void => setTxCompleteModal(false);
  const [updateHash, setUpdateHash] = useState("");
  const [factoryToken, setFactoryToken] = useState<object>({});
  const [invoiceTokenData, setInvoiceTokenData] = useState({
    tokenAddress: "",
    tokenSymbol: "",
  });
  let chainId = NaN;
  const columns: ColumnsType<FinalInvoiceDataType> = [
    {
      title: "Invoice number",
      dataIndex: "customInvoiceIdentifier",
    },
    {
      title: "Payer",
      dataIndex: "payer",
      render: (text): string => {
        return text?.email || "-";
      },
    },
    {
      title: "Recipient wallet address",
      dataIndex: "destinationPublicAddress",
    },

    {
      title: "Amount",
      dataIndex: "totalAmount",
      render: (text): string => {
        return (
          new bigDecimal(text).getValue() + ` ${invoiceTokenData.tokenSymbol}`
        );
      },
    },
  ];

  const blockchainConfigData: any = useSelector(
    (state: any) => state.blockchainConfigData
  );
  console.log("blockchainConfigData", blockchainConfigData, invoiceTokenData);

  let ERC20ContractAddress = "";
  const utilityContractsArr =
    blockchainConfigData.data &&
    blockchainConfigData.data.data.Tokens.map((tokenlist: any) => {
      return tokenlist.tokenlist.map((token: any) => {
        if (token.contractAddress === invoiceTokenData.tokenAddress) {
          chainId = token.chainId;
          ERC20ContractAddress = token.contractAddress;
        }
        return token.contractAddress;
      });
    });
  // if (ERC20ContractAddress !== invoiceTokenData.tokenAddress) {

  // }
  const blockchainName = blockchainConfigData.data.data.Blockchain.filter(
    (item: any) => {
      return item.chainId === chainId;
    }
  );

  console.log(
    "ERC20ContractAddress invoiceTokenData.tokenAddress chain id",
    ERC20ContractAddress,
    invoiceTokenData.tokenAddress,
    chainId,
    blockchainName[0]?.name
  );

  const Factory = new TokenFactory();

  const token = Factory.create(
    {
      tokenSmartContractAddress: ERC20ContractAddress,
      utilityContracts: utilityContractsArr,
      blockchainName: blockchainName[0]?.name,

      chainId: chainId,
    },
    invoiceTokenData.tokenSymbol
  );

  const onWallectConnect = (address: any): void => {
    setFactoryToken(token);
    dispatch(walletStateAction.updatePublicWalletAddress(address));
    handleSummaryModalOpen();
    setPublicAddress(address);
  };

  useEffect(() => {
    const addresses: string[] = [];
    const amounts: string[] = [];
    const ids: string[] = [];
    if (invoiceRowData) {
      setInvoiceTokenData({
        tokenAddress: invoiceRowData[0]?.tokenAddress,
        tokenSymbol: invoiceRowData[0]?.tokenSymbol,
      });
      const invoices: any = invoiceRowData;
      invoiceRowData.map((row: any) => {
        addresses.push(row.destinationPublicAddress);
        amounts.push(row.totalAmount.toString());
      });
      invoices.map((invoice: { id: string }) => {
        ids.push(invoice.id);
      });
      setReceipientAddresses(addresses);
      setReceipientAmounts(amounts);
      setInvoiceIds(ids);
    }
  }, [invoiceRowData]);

  // const onWalletSelect = async (walletName: string): Promise<void> => {
  //   if (walletName == "Metamask") {
  // let address = await connectToMetamask().catch((err) => {
  //   console.log(err);
  // });
  // const address = await token.connectWallet().catch((err) => {
  //   console.log(err);
  // });
  // if (address) {
  // setFactoryToken(token);
  // dispatch(walletStateAction.updatePublicWalletAddress(addr));
  // handleSummaryModalOpen();
  // setPublicAddress(address);
  // }
  //   }
  // };

  // const { address, isConnected } = useAccount();

  const onApprove = (): void => {
    setLoading(true);
    if (directoryId) {
      dispatch(
        ApproveStatusApiCall({
          directoryId: directoryId,
          status: "approved",
          invoiceIds: invoiceIds,
        })
      )
        .unwrap()
        .then((data) => {
          if (data?.statusCode === 200) {
            setLoading(false);
            onInvoiceApprove(true);
          }
        })
        .catch((err: Error) => {
          dispatch(apiFailureAction.apiFailure(err));
          message.error("Approved request failed !");
          setLoading(false);
        });
    }
  };

  const updateStatusToPaid = (): void => {
    if (directoryId) {
      dispatch(
        ApproveStatusApiCall({
          directoryId: directoryId,
          status: "paid",
          invoiceIds: invoiceIds,
        })
      )
        .unwrap()
        .then(({ data }) => {
          if (data?.statusCode === 200) {
            setLoading(false);
          }
        })
        .catch((err: Error) => {
          dispatch(apiFailureAction.apiFailure(err));
          message.error("Paid request failed !");
          setLoading(false);
        });
    }
  };

  const onCancel = (): void => {
    navigate(-1);
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={invoiceRowData || []}
        pagination={false}
        scroll={{ y: 330 }}
        loading={loading}
        style={{ scrollbarWidth: "thin" }}
        className="approve-modal-table"
        summary={(pageData) => {
          let tokenAmount: any = new bigDecimal(0);
          pageData.forEach(({ totalAmount }) => {
            tokenAmount = tokenAmount.add(new bigDecimal(totalAmount));
          });
          setTotalTokens(tokenAmount.getValue());
          return "";
        }}
      />

      <Row justify="start" align="middle" className="approve-total">
        <Col span={18}>
          <strong>Total:</strong>
        </Col>
        <Col>
          <strong style={{ marginLeft: "20px" }}>
            {`${totalTokens} ${invoiceTokenData.tokenSymbol}`}{" "}
          </strong>
        </Col>
      </Row>
      <Row gutter={[0, 16]} justify="end">
        <Col span={6} className="cancel-modal-btn" onClick={onCancel}>
          <strong>Cancel</strong>
        </Col>
        {status === "pending" && (
          <Col span={6} className="approve-modal-btn" onClick={onApprove}>
            <strong>Approve</strong>
          </Col>
        )}
        {status === "approved" && (
          <>
            {/* <strong>Proceed to Pay</strong> */}
            <WalletModal
              // onWalletSelect={onWalletSelect}
              handleWalletClose={handleWalletClose}
              openWalletModal={openWalletModal}
              onWalletConnect={onWallectConnect}
            />
          </>
        )}
      </Row>
      {/* {openWalletModal && (
        <WalletModal
          // onWalletSelect={onWalletSelect}
          handleWalletClose={handleWalletClose}
          openWalletModal={openWalletModal}
          onWalletConnect={onWallectConnect}
        />
      )} */}
      {openSummaryModal && (
        <SummaryPageModal
          openSummaryModal={openSummaryModal}
          handleSummaryModalClose={handleSummaryModalClose}
          publicAddress={publicAddress}
          totalTokens={totalTokens}
          receipientAddresses={receipientAddresses}
          receipientAmounts={receipientAmounts}
          invoiceIds={invoiceIds}
          updateStatusToPaid={updateStatusToPaid}
          handleTxCompleteModalOpen={handleTxCompleteModalOpen}
          setUpdateHash={setUpdateHash}
          token={factoryToken}
          ERC20Contract={ERC20ContractAddress}
        />
      )}

      {openTxCompleteModal && (
        <TransactionComplete
          newsetupdatehash={updateHash}
          openTxCompleteModal={openTxCompleteModal}
          handleTxCompleteModalClose={handleTxCompleteModalClose}
          directoryIdentifier={directoryIdentifier}
          blockchainName={blockchainName[0].name.toLowerCase()}
        />
      )}
    </>
  );
};

export default FinalInvoiceTable;
