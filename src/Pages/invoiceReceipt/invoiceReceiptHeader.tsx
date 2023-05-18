import { DownloadOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { apiFailureAction } from "../../commonApiLogic";
import { AppDispatch } from "../../store";
import { directoryDetailApiCall } from "../Invoice/logic";
import { GeneratePdfApiCall } from "./logic";
interface FuncProp {
  breadCrumb: string;
  invoiceIdentifier: string;
}

const InvoiceReceiptHeader: React.FC<FuncProp> = ({
  breadCrumb,
  invoiceIdentifier,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [generatePdfLoading, setGeneratePdfLoading] = useState(false);
  const [directoryName, setDirectoryName] = useState("");
  const pathSnippets = breadCrumb?.split("/").filter((i) => i);

  const apiCallForDirectoryDetail = (): void => {
    if (pathSnippets[1]) {
      dispatch(directoryDetailApiCall(pathSnippets[1]))
        .unwrap()
        .then(({ data }) => {
          setDirectoryName(data.data.name);
        })
        .catch((err: Error) => {
          dispatch(apiFailureAction.apiFailure(err));
        });
    }
  };

  useEffect(() => {
    apiCallForDirectoryDetail();
  }, []);
  const generatePdf = (): void => {
    setGeneratePdfLoading(true);
    dispatch(GeneratePdfApiCall(invoiceIdentifier))
      .unwrap()
      .then((data) => {
        console.log("data", data.data);
        const blob = new Blob([data.data], { type: "application/pdf" });
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        const filename = `${invoiceIdentifier}.pdf`;
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

  const renderBreadcrumbItem = (): JSX.Element => {
    return (
      <>
        <Breadcrumb.Item
          key={`breadCrumb_invoice_#w2`}
          className="project-crumbItem"
        >
          <Link to={`/`}>Directory List</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item
          key={`breadCrumb_invoice_#r53`}
          className="project-crumbItem"
        >
          <Link to={`/directory/${pathSnippets[1]}`}>
            {directoryName || "-"}
          </Link>
        </Breadcrumb.Item>
      </>
    );
  };

  return (
    <>
      <Row justify="space-between" className="project-header">
        <Col>
          <Breadcrumb separator=">">
            {renderBreadcrumbItem()}
            <Breadcrumb.Item
              key={`breadCrumb_invoice`}
              className="project-crumbItem"
            >
              {`${invoiceIdentifier || ""}`}
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col className="myProfile">
          <Row align="middle"></Row>
        </Col>
      </Row>
      <Row justify="space-between" align="middle" className="project-header">
        <Col>
          <strong className="invoiceNo">
            Invoice No: {invoiceIdentifier || "-"}
          </strong>
        </Col>
        <Col>
          <Button
            type="primary"
            size="large"
            icon={<DownloadOutlined />}
            className="invoice-btn"
            onClick={generatePdf}
            loading={generatePdfLoading}
          >
            Download invoice
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default InvoiceReceiptHeader;
