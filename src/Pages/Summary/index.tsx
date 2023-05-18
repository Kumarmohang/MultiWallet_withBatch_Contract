import { Breadcrumb, Col, Image, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { Link, useLocation } from "react-router-dom";
import { apiFailureAction } from "../../commonApiLogic";
import {
  DataTypeForDirectoryDetail,
  FinalInvoiceDataType,
} from "../../index.d";
import { AppDispatch } from "../../store";
import { directoryDetailApiCall } from "../Invoice/logic";
import ApprovedPage from "./approvedPage";
import FinalInvoiceTable from "./finalInvoiceTable";

const Summary: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const locationState = useLocation().state as {
    invoiceRowData: FinalInvoiceDataType[];
    breadCrumb: string;
    status: string;
    directoryId: string;
  };

  const [DirectoryDetailData, setDirectoryDetailData] =
    useState<DataTypeForDirectoryDetail>();

  const [approvePage, setApprovePage] = useState(false);
  const [successPage /* setSuccessPage */] = useState(false);
  const pathSnippets = locationState?.breadCrumb?.split("/").filter((i) => i);

  const apiCallForDirectoryDetail = (): void => {
    if (pathSnippets[1]) {
      dispatch(directoryDetailApiCall(pathSnippets[1]))
        .unwrap()
        .then(({ data }) => {
          console.log("data", data);
          setDirectoryDetailData(data.data);
        })
        .catch((err: Error) => {
          dispatch(apiFailureAction.apiFailure(err));
        });
    }
  };

  const renderDirectoryHeader = (): JSX.Element => {
    return (
      <>
        <Col>
          <Image
            src={"/assets/images/DirectoryIconOrange.svg"}
            alt="pic"
            preview={false}
          />
        </Col>
        <Col>
          <span className="img_content">
            <div>{DirectoryDetailData?.name}</div>
            {!successPage ? (
              <></>
            ) : (
              <h3>{`You are paid for ${
                locationState?.invoiceRowData?.length || 0
              } invoices`}</h3>
            )}
          </span>
        </Col>
      </>
    );
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
            {DirectoryDetailData?.name || "-"}
          </Link>
        </Breadcrumb.Item>
      </>
    );
  };

  const onInvoiceApprove = (arg: boolean): void => {
    setApprovePage(arg);
  };

  useEffect(() => {
    apiCallForDirectoryDetail();
  }, []);

  return (
    <div className="summary">
      <Row justify="space-between" className="project-header">
        <Col>
          <Breadcrumb separator=">">
            {renderBreadcrumbItem()}
            <Breadcrumb.Item
              key={`breadCrumb_invoice`}
              className="project-crumbItem"
            >
              Invoice
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>
      <Row className="img-heading" justify="start" align="middle">
        {renderDirectoryHeader()}
      </Row>

      {locationState.status === "pending" && !approvePage && (
        <Row className="final-invoice-table">
          <Col>
            <FinalInvoiceTable
              invoiceRowData={locationState?.invoiceRowData || []}
              onInvoiceApprove={onInvoiceApprove}
              status={locationState?.status}
              directoryId={locationState?.directoryId}
              directoryIdentifier={pathSnippets[1]}
            />
          </Col>
        </Row>
      )}
      {locationState.status === "pending" && approvePage && (
        <Row className="approved-page">
          <ApprovedPage historyParam={locationState?.breadCrumb} />
        </Row>
      )}
      {locationState.status === "approved" && (
        <Row className="final-invoice-table">
          <Col>
            <FinalInvoiceTable
              invoiceRowData={locationState?.invoiceRowData || []}
              onInvoiceApprove={onInvoiceApprove}
              status={locationState?.status}
              directoryId={locationState?.directoryId}
              directoryIdentifier={pathSnippets[1]}
            />
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Summary;
