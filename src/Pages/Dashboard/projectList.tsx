import React, { useEffect, useState } from "react";
import { Col, Divider, List, Row, Skeleton, Typography } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import { DataTypeForList } from "../../index.d";
import { Link } from "react-router-dom";
import { AppDispatch } from "../../store";
import { useDispatch } from "react-redux";
import { ProjectListApiCall } from "./logic";
import { apiFailureAction } from "../../commonApiLogic";

const { Text } = Typography;

interface FuncProps {
  projectListParam: string;
  listHeader: string[];
}

const ProjectList: React.FC<FuncProps> = ({ projectListParam, listHeader }) => {
  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [projectListData, setProjectListData] = useState<DataTypeForList[]>([]);

  const loadMoreData = (): void => {
    const urlParams = new URLSearchParams(location.search).toString();
    setLoading(true);
    dispatch(ProjectListApiCall(urlParams))
      .unwrap()
      .then(({ data }) => {
        setProjectListData([...data.results]);
        setLoading(false);
      })
      .catch((err: Error) => {
        dispatch(apiFailureAction.apiFailure(err));
        setLoading(false);
      });
  };

  const renderListHeader = (listArr: string[]): JSX.Element[] | JSX.Element => {
    return listArr.map((item, index) => {
      if (item === "Directories") {
        return (
          <Col span={9} className="category" key={`list-header${index + 1}`}>
            <Text className="header-title" type="secondary">
              {item}
            </Text>
          </Col>
        );
      } else {
        return (
          <Col span={3} key={`list-header${index + 1}`}>
            <Text className="header-title" type="secondary">
              {item}
            </Text>
          </Col>
        );
      }
    });
  };

  useEffect(() => {
    loadMoreData();
  }, []);

  useEffect(() => {
    if (projectListParam.length > 0) {
      setProjectListData([]);
      loadMoreData();
    }
  }, [projectListParam]);

  return (
    <>
      <Row className="projectList-header" justify="center">
        {renderListHeader(listHeader)}
      </Row>
      <div id="scrollableDiv">
        <InfiniteScroll
          dataLength={projectListData.length}
          next={loadMoreData}
          hasMore={projectListData.length < 50}
          loader={
            loading ? <Skeleton avatar paragraph={{ rows: 1 }} active /> : ""
          }
          endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
          scrollableTarget="scrollableDiv"
        >
          <List
            dataSource={projectListData?.length > 0 ? projectListData : []}
            loading={loading}
            renderItem={(item, index) => (
              <List.Item
                key={`list_item${index + 1}`}
                className="projectList-items"
              >
                <Row align="middle">
                  <Col span={2}>
                    {" "}
                    <img src={"/assets/images/directoryIcon.svg"} alt="pic" />
                  </Col>
                  <Col span={8} className="category-item">
                    <Link
                      to={`/directory/${item?.customDirectoryIdentifier}`}
                      className="no-border"
                    >
                      {item?.name || "-"}
                    </Link>
                  </Col>
                  <Col span={4}>
                    <Text className="dates">
                      {item?.startDate
                        ? new Date(item?.startDate).toLocaleDateString()
                        : "-"}
                    </Text>
                  </Col>
                  <Col span={2}>
                    <Text className="dates">
                      {item?.endDate
                        ? new Date(item?.endDate).toLocaleDateString()
                        : "-"}
                    </Text>
                  </Col>
                  <Col span={3}>
                    <Text>{item?.statistics?.invoiceCount || 0}</Text>
                  </Col>
                  <Col span={3}>
                    <Text className="paid-invoices">
                      {item?.statistics?.paidInvoices || 0}
                    </Text>
                  </Col>
                </Row>
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
    </>
  );
};

export default ProjectList;
