import React, { useEffect, useState } from "react";
import { Col, Divider, List, Row, Skeleton, Typography } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import { ListHeader, TransactionMetadata } from "../../index.d";
import { Link } from "react-router-dom";
import { AppDispatch } from "../../store";
import { useDispatch } from "react-redux";
import { TransactionListApiCall } from "./logic";
import { apiFailureAction } from "../../commonApiLogic";
import StatusTag from "../../Components/StatusTag";

const { Text } = Typography;

interface FuncProps {
  transactionListParam: string;
  listHeader: ListHeader[];
}

const TransactionList: React.FC<FuncProps> = ({
  transactionListParam,
  listHeader,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [transactionListData, setTransactionListData] = useState<
    TransactionMetadata[]
  >([]);

  const loadMoreData = (): void => {
    const urlParams = new URLSearchParams(location.search).toString();
    setLoading(true);
    dispatch(TransactionListApiCall(urlParams))
      .unwrap()
      .then(({ data }) => {
        setTransactionListData([...data.results]);
        setLoading(false);
      })
      .catch((err: Error) => {
        dispatch(apiFailureAction.apiFailure(err));
        setLoading(false);
      });
  };

  const renderListHeader = (): JSX.Element[] | JSX.Element => {
    return listHeader.map((item, index) => {
      return (
        <Col
          span={item.span}
          className="category"
          key={`list-header${index + 1}`}
          style={{ textAlign: item.align || "left" }}
        >
          <Text className="header-title" type="secondary">
            {item.title}
          </Text>
        </Col>
      );
    });
  };

  useEffect(() => {
    loadMoreData();
  }, []);

  useEffect(() => {
    if (transactionListParam.length > 0) {
      setTransactionListData([]);
      loadMoreData();
    }
  }, [transactionListParam]);

  return (
    <>
      <Row className="projectList-header" justify="start">
        {renderListHeader()}
      </Row>
      <div id="scrollableDiv">
        <InfiniteScroll
          dataLength={transactionListData.length}
          next={loadMoreData}
          hasMore={transactionListData.length < 50}
          loader={
            loading ? <Skeleton avatar paragraph={{ rows: 1 }} active /> : ""
          }
          endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
          scrollableTarget="scrollableDiv"
        >
          <List
            dataSource={
              transactionListData?.length > 0 ? transactionListData : []
            }
            loading={loading}
            renderItem={(item, i) => {
              const { status } = item;
              return (
                <List.Item key={`${item.id}`} className="projectList-items1">
                  <Row align="middle" justify="start">
                    <Col
                      span={listHeader[0].span}
                      className={`category-item`}
                      style={{ textAlign: "left" }}
                    >
                      {`${i + 1}.  `}
                    </Col>
                    <Col
                      span={listHeader[1].span}
                      className={`category-item`}
                      style={{ textAlign: "left" }}
                    >
                      <Link
                        to={`/transactions/${item.id}`}
                        className="no-border"
                      >
                        {item.id}
                      </Link>
                    </Col>
                    <Col
                      span={listHeader[2].span}
                      style={{ textAlign: "left" }}
                    >
                      <Text className="dates">
                        {item?.createdAt
                          ? new Date(item.createdAt).toLocaleDateString()
                          : "-"}
                      </Text>
                    </Col>
                    <Col
                      span={listHeader[3].span}
                      style={{ textAlign: "left" }}
                    >
                      <Text className="">{item.callerAddress || "-"}</Text>
                    </Col>
                    <Col
                      span={listHeader[4].span}
                      style={{ textAlign: "left" }}
                    >
                      <StatusTag status={status} />
                    </Col>
                  </Row>
                </List.Item>
              );
            }}
          />
        </InfiniteScroll>
      </div>
    </>
  );
};

export default TransactionList;
