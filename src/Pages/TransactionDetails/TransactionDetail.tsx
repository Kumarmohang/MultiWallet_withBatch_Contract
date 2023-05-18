import { Breadcrumb, Col, Image, Row, Button } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { apiFailureAction } from "../../commonApiLogic";
import StatusTag from "../../Components/StatusTag";
import { TransactionDetailResponse } from "../../index.d";
import { AppDispatch } from "../../store";
import { GenerateRecieptPdfApiCall, transactionDetailApiCall } from "./logic";
import { DownloadOutlined } from "@ant-design/icons";

const TransactionDetail: React.FC = () => {
  const { txnId } = useParams();
  const dispatch: AppDispatch = useDispatch();
  const [generatePdfLoading, setGeneratePdfLoading] = useState(false);

  const [transactionDetailData, setTransactionDetailData] =
    useState<TransactionDetailResponse>();

  const apiCallForTransactionDetail = (): void => {
    if (txnId) {
      dispatch(transactionDetailApiCall(txnId))
        .unwrap()
        .then(({ data }) => {
          setTransactionDetailData(data.data);
        })
        .catch((err: Error) => {
          dispatch(apiFailureAction.apiFailure(err));
        });
    }
  };

  const generatePdf = (): void => {
    setGeneratePdfLoading(true);
    dispatch(GenerateRecieptPdfApiCall(txnId))
      .unwrap()
      .then((data) => {
        const blob = new Blob([data.data], { type: "application/pdf" });
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        const filename = `${txnId}.pdf`;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setGeneratePdfLoading(false);
      })
      .catch((err) => {
        console.log("err", err);
        setGeneratePdfLoading(false);
      });
  };

  const renderTransactionHeader = (): JSX.Element => {
    return (
      <>
        <Col span={3}>
          <Image
            src={"/assets/images/Transaction_orange.svg"}
            alt="pic"
            preview={false}
            width={40}
            height={40}
            style={{ marginTop: 20 }}
          />
        </Col>
        <Col span={9} style={{ wordBreak: "break-word" }}>
          <span className="img_content">
            <div>Transaction Id</div>
            <h3>{txnId || "-"}</h3>
          </span>
        </Col>
        <Col span={5}>
          <span className="img_content">
            <div>Total invoices</div>
            <h3>
              {transactionDetailData?.invoiceCount
                ? `${transactionDetailData?.invoiceCount} Invoices`
                : 0}
            </h3>
          </span>
        </Col>
        <Col span={5}>
          <span className="img_content">
            <div>Transaction date</div>
            <h3>
              {transactionDetailData
                ? new Date(
                    transactionDetailData.transaction.createdAt
                  ).toLocaleDateString()
                : "-"}
            </h3>
          </span>
        </Col>
        <Col span={2}>
          <span className="img_content1">
            <div>Status</div>
            <h3 style={{ marginRight: "-8px" }}>
              {transactionDetailData ? (
                <StatusTag status={transactionDetailData?.transaction.status} />
              ) : (
                "-"
              )}
            </h3>
          </span>
        </Col>
      </>
    );
  };

  useEffect(() => {
    apiCallForTransactionDetail();
  }, []);

  return (
    <>
      <Row className="project-header1" justify="space-between">
        <Col>
          <Breadcrumb separator=">">
            <Breadcrumb.Item key="project_1" className="project-crumbItem">
              <Link to="/transactions">Past transactions</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item key="project_id_1" className="project-crumbItem">
              {transactionDetailData?.transaction.id || ""}
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col className="myProfile">
          <Row align="middle"></Row>
        </Col>
      </Row>
      <Row className="projectList-container">
        <Col span={24}>
          <div className="project-category">
            <Row className="img-heading" justify="end">
              {renderTransactionHeader()}
            </Row>
          </div>
        </Col>
      </Row>
      {transactionDetailData?.transaction.status === "complete" && (
        <Row justify="end" style={{ padding: "0 3%" }}>
          <Col>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              className="invoice-btn"
              onClick={generatePdf}
              loading={generatePdfLoading}
            >
              Download Receipt
            </Button>
          </Col>
        </Row>
      )}
    </>
  );
};

export default TransactionDetail;
