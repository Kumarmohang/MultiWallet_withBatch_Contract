import { Col, Image, Modal, Row } from "antd";
import React, { useState } from "react";

interface FuncProp {
  handleApproveModal: (arg: boolean) => void;
}

const SelectWalletModal: React.FC<FuncProp> = ({ handleApproveModal }) => {
  const [open, setOpen] = useState(true);

  const handleOpen = (): void => {
    handleApproveModal(false);
    setOpen(false);
  };

  return (
    <Modal
      title={
        <div className="approve_title">
          <Image
            src={"/assets/images/CategoryPic.svg"}
            alt="pic"
            preview={false}
          />
          <span className="img_content">
            <h3>Directory 1 invoices</h3>
          </span>
        </div>
      }
      centered
      open={open}
      width={"55%"}
      //  onOk={() => setOpen(false)}
      onCancel={() => handleOpen()}
      footer={null}
      className="Invoice-modal"
    >
      <Row justify="start" align="middle" className="approve-total">
        <Col span={18}>
          <strong>Total:</strong>
        </Col>
        <Col>
          <strong style={{ marginLeft: "20px" }}>74738.65 AMR</strong>
        </Col>
      </Row>
      <Row>
        <Col className="total-amount-line">
          <strong>
            Total amount paid against 3265 invoices can proceed to approve and
            pay
          </strong>
        </Col>
        <Col className="approve-modal-btn">
          <strong>Approve</strong>
        </Col>
      </Row>
    </Modal>
  );
};

export default SelectWalletModal;
