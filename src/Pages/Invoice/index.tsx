import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DirectoryDetail from "./directoryDetail";
import InvoiceForm from "./invoiceForm";
import InvoiceTable from "./invoiceTable";

const Invoice: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [projectParam, setProjectParam] = useState(location.search);

  const onSearch = (queryParam: string): void => {
    navigate(`${location.pathname}?${queryParam}`);
    setProjectParam(queryParam);
  };

  useEffect(() => {
    const queryParam = new URLSearchParams(location.search);
    queryParam.delete("oneTimeAccessToken");
    navigate({ search: queryParam.toString() });
  }, []);

  return (
    <div className="project">
      <DirectoryDetail />
      <Row className="projectList-container">
        <Col>
          <div className="project-category">
            <div className="project-table-form">
              <InvoiceForm propOnSearch={onSearch} />
            </div>
            <Row className="project-table" justify="center" gutter={[16, 32]}>
              <InvoiceTable projectParam={projectParam} />
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Invoice;
