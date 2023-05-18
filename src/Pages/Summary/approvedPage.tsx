import { Button, Col, Image } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

interface FuncProp {
  historyParam: string;
}

const ApprovedPage: React.FC<FuncProp> = ({ historyParam }) => {
  const navigate = useNavigate();

  const handleClick = (): void => {
    navigate(`${historyParam}?status=approved`, { replace: true });
  };

  return (
    <>
      <Col span={24} className="success-heading">
        <strong>Successfully Approved</strong>
      </Col>
      <Col className="checked-icon" span={24}>
        <Image
          src={"/assets/images/approve_circle.svg"}
          alt="pic"
          preview={false}
        />
      </Col>
      <Col span={24} className="icon-bottom-line">
        <strong>You now proceed to pay this invoice</strong>
      </Col>
      <Col span={24}>
        <Button
          type="default"
          size="large"
          className="approve-close-btn"
          onClick={() => handleClick()}
        >
          Close
        </Button>
      </Col>
    </>
  );
};

export default ApprovedPage;
