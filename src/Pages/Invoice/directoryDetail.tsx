import { Breadcrumb, Col, Image, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { apiFailureAction } from "../../commonApiLogic";
import { DataTypeForDirectoryDetail } from "../../index.d";
import { AppDispatch } from "../../store";
import { directoryDetailApiCall } from "./logic";

const DirectoryDetail: React.FC = () => {
  const { identifier } = useParams();
  const dispatch: AppDispatch = useDispatch();
  const [directoryDetailData, setDirectoryDetailData] =
    useState<DataTypeForDirectoryDetail>();

  const apiCallForDirectoryDetail = (): void => {
    if (identifier) {
      dispatch(directoryDetailApiCall(identifier))
        .unwrap()
        .then(({ data }) => {
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
        <Col span={4}>
          <Image
            src={"/assets/images/DirectoryIconOrange.svg"}
            alt="pic"
            preview={false}
          />
        </Col>
        <Col span={6} style={{ wordBreak: "break-word" }}>
          <span className="img_content">
            <div>Identifier</div>
            <h3>{identifier || "-"}</h3>
          </span>
        </Col>
        <Col span={4}>
          <span className="img_content">
            <div>Total invoices</div>
            <h3>
              {directoryDetailData?.totalInvoices
                ? `${directoryDetailData?.totalInvoices} Invoices`
                : "-"}
            </h3>
          </span>
        </Col>
        <Col span={4}>
          <span className="img_content">
            <div>Project issued on</div>
            <h3>
              {directoryDetailData
                ? new Date(directoryDetailData?.startDate).toLocaleDateString()
                : "-"}
            </h3>
          </span>
        </Col>
      </>
    );
  };

  useEffect(() => {
    apiCallForDirectoryDetail();
  }, []);

  return (
    <>
      <Row justify="space-between" className="project-header">
        <Col>
          <Breadcrumb separator=">">
            <Breadcrumb.Item key="project_1" className="project-crumbItem">
              <Link to="/">Directory List</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item key="project_id_1" className="project-crumbItem">
              {directoryDetailData?.name || ""}
            </Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        <Col className="myProfile">
          <Row align="middle"></Row>
        </Col>
      </Row>
      <Row className="projectList-container">
        <Col span={24}>
          <div className="project-category">
            <Row
              className="img-heading"
              justify="start"
              align="middle"
              gutter={32}
            >
              {renderDirectoryHeader()}
            </Row>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default DirectoryDetail;
