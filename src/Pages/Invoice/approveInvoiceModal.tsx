import { Col, Image, Modal, Row, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import React, { useState } from "react";

interface FuncProp {
  handleApproveModal: (arg: boolean) => void;
  handleWalletModal: (arg: boolean) => void;
}

interface DataType {
  invoiceNumber: number;
  recipient: string;
  recipient_wallet_address: string;
  amount: number;
}

const columns: ColumnsType<DataType> = [
  {
    title: "Invoice number",
    dataIndex: "invoiceNumber",
  },
  {
    title: "Recipient",
    dataIndex: "recipient",
  },
  {
    title: "Recipient wallet address",
    dataIndex: "recipient_wallet_address",
  },

  {
    title: "Amount",
    dataIndex: "amount",
  },
];

const data: DataType[] = [];
for (let i = 0; i < 20; i++) {
  data.push({
    invoiceNumber: i + 1,
    recipient: "Alexander Parkinson",
    recipient_wallet_address: "edg7636r43ryg3ydjd843yr",
    amount: 200,
  });
}

const ApproveInvoiceModal: React.FC<FuncProp> = ({
  handleApproveModal,
  handleWalletModal,
}) => {
  const [open, setOpen] = useState(true);

  const handleOpen = (): void => {
    handleApproveModal(false);
    setOpen(false);
  };

  const handleWalletClick = (): void => {
    setOpen(false);
    handleWalletModal(true);
  };

  return (
    <>
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
              <p>You are going to pay 2541 invoices</p>
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
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          scroll={{ y: 350 }}
          //bordered
          style={{ scrollbarWidth: "thin" }}
          className="approve-modal-table"
        />

        <Row justify="start" align="middle" className="approve-total">
          <Col span={18}>
            <strong>Total:</strong>
          </Col>
          <Col>
            <strong style={{ marginLeft: "20px" }}>74738.65 AMR</strong>
          </Col>
        </Row>
        <Row gutter={[0, 16]}>
          <Col span={24} className="total-amount-line">
            <strong>
              Total amount paid against 3265 invoices can proceed to approve and
              pay
            </strong>
          </Col>
          <Col
            span={24}
            className="approve-modal-btn"
            onClick={handleWalletClick}
          >
            <strong>Approve</strong>
          </Col>
          <Col span={24} className="approve-modal-meta">
            <strong>You are connected with wallet Metamask (2121dwd...)</strong>
          </Col>
        </Row>
      </Modal>
    </>
  );
};
export default ApproveInvoiceModal;
