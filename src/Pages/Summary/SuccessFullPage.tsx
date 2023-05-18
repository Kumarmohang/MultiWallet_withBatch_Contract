import { CheckCircleOutlined } from "@ant-design/icons";
import { Button, Col } from "antd";
import React from "react";

const SuccessFullPage: React.FC = () => {
  return (
    <>
      <Col span={24} className="success-heading">
        <strong>Successfully Paid</strong>
      </Col>
      <Col className="checked-icon successIcon" span={24}>
        <CheckCircleOutlined />
      </Col>
      <Col span={24} className="icon-bottom-line">
        <strong>Transaction initiated successfully</strong>
      </Col>

      <Col span={24}>
        <Button
          type="default"
          size="large"
          className="approve-close-btn"
          onClick={() => history.back()}
        >
          Close
        </Button>
      </Col>
    </>
  );
};

export default SuccessFullPage;
