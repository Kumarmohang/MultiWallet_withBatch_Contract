import React from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { FinalInvoiceDataType } from "../../index.d";

interface FuncProp {
  invoiceRowData?: FinalInvoiceDataType[];
  onInvoiceApprove: (arg: boolean) => void;
}
const columns: ColumnsType<FinalInvoiceDataType> = [
  {
    title: "Invoice number",
    dataIndex: "invoiceNumber",
  },
  {
    title: "Payer",
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

const ProceedToPayPage: React.FC<FuncProp> = ({
  invoiceRowData,
  onInvoiceApprove,
}) => {
  const navigate = useNavigate();

  const onApprove = (): void => {
    onInvoiceApprove(true);
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
      <Row gutter={[0, 16]} justify="end">
        <Col span={6} className="cancel-modal-btn" onClick={onCancel}>
          <strong>Cancel</strong>
        </Col>
        <Col span={6} className="approve-modal-btn" onClick={onApprove}>
          <strong>Proceed To Pay</strong>
        </Col>
      </Row>
    </>
  );
};

export default ProceedToPayPage;
