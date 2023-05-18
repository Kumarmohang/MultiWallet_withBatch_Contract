import React from "react";
import { Breadcrumb, Col, Row } from "antd";
import { Link } from "react-router-dom";
import TransactionList from "./transactionList";
import { ListHeader } from "../../index.d";

const TransactionListHeaader: ListHeader[] = [
  { title: "No", span: 1, align: "left", key: "i" },
  { title: "Transaction ID", span: 8, align: "left", key: "id" },
  { title: "Transaction Date", span: 4, align: "left", key: "createdAt" },
  { title: "Payer", span: 8, align: "left", key: "callerAddress" },
  { title: "Status", span: 3, align: "left", key: "status" },
];

const Dashboard: React.FC = () => {
  return (
    <div className="project">
      <Row justify="space-between" className="project-header">
        <Col>
          <Breadcrumb separator=">">
            <Breadcrumb.Item key="transaction_1" className="project-crumbItem">
              <Link to="/transactions">Past Transactions</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col className="myProfile">
          <Row align="middle"></Row>
        </Col>
      </Row>
      <Row className="projectList-container">
        <Col span={24}>
          <TransactionList
            transactionListParam={""}
            listHeader={TransactionListHeaader}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
