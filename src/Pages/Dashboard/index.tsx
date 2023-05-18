import React, { useState } from "react";
import { Breadcrumb, Col, Row } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ProjectList from "./projectList";
import ProjectForm from "./projectForm";

const ListHeader = [
  "Directories",
  "Start Date",
  "End Date",
  "Total Invoices",
  "Paid",
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [projectListParam, setProjectListParam] = useState(location.search);

  const onSearch = (queryParam: string): void => {
    navigate(`${location.pathname}?${queryParam}`, { replace: true });
    setProjectListParam(queryParam);
  };

  return (
    <div className="project">
      <Row justify="space-between" className="project-header">
        <Col>
          <Breadcrumb separator=">">
            <Breadcrumb.Item key="project_1" className="project-crumbItem">
              <Link to="/">Directory List</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col className="myProfile">
          <Row align="middle"></Row>
        </Col>
      </Row>
      <Row className="projectList-container">
        <Col span={24}>
          <div className="projectList-form">
            <ProjectForm propOnSearch={onSearch} />
          </div>

          <ProjectList
            projectListParam={projectListParam}
            listHeader={ListHeader}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
