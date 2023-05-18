import { Table, Col } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { TransactionInvoicesApiCall } from "./logic";
import { AppDispatch, RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { apiFailureAction } from "../../commonApiLogic";
import {
  ApiState,
  DataTypeForProjectInvoices,
  TransactionDetailResponse,
} from "../../index.d";
import bigDecimal from "js-big-decimal";

const columns: ColumnsType<DataTypeForProjectInvoices> = [
  {
    title: "Invoice No.",
    dataIndex: "customInvoiceIdentifier",
  },
  {
    title: "Date",
    dataIndex: "creationDate",
    render: (text: string): string => {
      return text ? new Date(text).toLocaleDateString() : "-";
    },
  },
  {
    title: "Amount",
    dataIndex: "totalAmount",
    render: (text) => new bigDecimal(text).getValue(),
  },
  {
    title: "Payment Method",
    dataIndex: "tokenSymbol",
  },
];

const TransactionInvoiceTable: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [invoicesData, setInvoicesData] = useState<
    DataTypeForProjectInvoices[]
  >([]);
  const [loading, setLoading] = useState(false);

  const transactionDetailsStore: ApiState = useSelector(
    (state: RootState) => state.transactionDetailData
  );

  const transactionDetailsData: TransactionDetailResponse | any =
    transactionDetailsStore?.data;

  const apiCallForInvoices = (): void => {
    setLoading(true);

    const invoicesQuery = `txnId=${transactionDetailsData?.transaction.id}`;
    dispatch(TransactionInvoicesApiCall(invoicesQuery))
      .unwrap()
      .then(({ data }) => {
        setInvoicesData(data.results);
        setLoading(false);
      })
      .catch((err: Error) => {
        dispatch(apiFailureAction.apiFailure(err));
        setLoading(false);
      });
  };

  useEffect(() => {
    if (transactionDetailsData?.transaction.id) {
      apiCallForInvoices();
    }
  }, [transactionDetailsData]);

  return (
    <>
      <>
        <Col>
          <Table
            columns={columns}
            dataSource={invoicesData || []}
            pagination={false}
            loading={loading}
            scroll={{ y: 350 }}
            summary={(pageData) => {
              let totalToken = 0;
              let symbol = "";
              let tokenAmount: any = new bigDecimal(0);
              pageData.forEach(({ totalAmount = 0, tokenSymbol = "" }) => {
                tokenAmount = tokenAmount.add(new bigDecimal(totalAmount || 0));
                symbol = tokenSymbol;
              });
              totalToken = tokenAmount.getValue();
              return (
                <>
                  <Table.Summary.Row
                    style={{
                      fontSize: "16px",
                    }}
                  >
                    <Table.Summary.Cell index={0} colSpan={3}>
                      Total
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      {totalToken} {symbol}
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </>
              );
            }}
          />
        </Col>
      </>
    </>
  );
};

export default TransactionInvoiceTable;
