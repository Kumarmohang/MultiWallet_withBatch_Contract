import { Col, Row } from "antd";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DirectoryDetail from "./TransactionDetail";
import TransactionInvoiceTable from "./TransactionInvoiceTable";

const Invoice: React.FC = () => {
  const navigate = useNavigate();
  const param = useParams();
  useEffect(() => {
    if (param.txnId) {
      const queryParam = new URLSearchParams({ txnId: param.txnId });
      queryParam.delete("oneTimeAccessToken");
      navigate({ search: queryParam.toString() });
    }
  }, []);

  return (
    <div className="project">
      <DirectoryDetail />
      <Row className="projectList-container">
        <Col>
          <div className="project-category">
            <Row
              className="project-table transaction-invoice-table"
              justify="center"
              gutter={[16, 32]}
            >
              <TransactionInvoiceTable />
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Invoice;
