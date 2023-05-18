import { Table, Button, Col } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";
import React, { useEffect, useState } from "react";
import queryString from "query-string";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { InvoicesApiCall } from "./logic";
import { AppDispatch, RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { DataTypeForProjectInvoices, ApiState } from "../../index.d";
import { apiFailureAction } from "../../commonApiLogic";
import bigDecimal from "js-big-decimal";

interface FuncProps {
  projectParam: string;
}

const columns: ColumnsType<DataTypeForProjectInvoices> = [
  {
    title: "Invoice No",
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
    render: (text) => {
      return new bigDecimal(text).getValue();
    },
  },
  {
    title: "Payment Method",
    dataIndex: "tokenSymbol",
  },
  {
    title: "Status",
    dataIndex: "status",
    render: (text) => {
      return text == "paid" ? (
        <Link to="/transactions">
          <Button
            className="project-table-status project-table-status-paid"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="status-dot"></span>
            {text[0].toUpperCase() + text.slice(1)}
          </Button>
        </Link>
      ) : (
        <Button className="project-table-status">
          <span className="status-dot"></span>
          {text[0].toUpperCase() + text.slice(1)}
        </Button>
      );
    },
  },
];

const InvoiceTable: React.FC<FuncProps> = ({ projectParam }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const queryParam = queryString.parse(location.search);
  const [selectedPendingRowKeys, setSelectedPendingRowKeys] = useState<
    React.Key[]
  >([]);
  const [selectedApproveRowKeys, setSelectedApproveRowKeys] = useState<
    React.Key[]
  >([]);
  const [approveBtnDisplay, setApproveBtnDisplay] = useState(true);
  const [proceedBtnDisplay, setProceedBtnDisplay] = useState(true);
  const [invoicesData, setInvoicesData] = useState<
    DataTypeForProjectInvoices[]
  >([]);
  const [loading, setLoading] = useState(false);
  const approveBtnCondition = approveBtnDisplay
    ? "project-btn"
    : "project-btn-approve";
  const proceedBtnPrimary = proceedBtnDisplay
    ? "project-btn"
    : "project-btn-primary";

  const directoryDetail: ApiState = useSelector(
    (state: RootState) => state.directoryDetailData
  );

  const directoryData: any = directoryDetail?.data;

  const onPendingSelectChange = (newSelectedRowKeys: React.Key[]): void => {
    setSelectedPendingRowKeys(newSelectedRowKeys);
    setApproveBtnDisplay(!approveBtnDisplay);
  };

  const onApproveSelectChange = (newSelectedRowKeys: React.Key[]): void => {
    setSelectedApproveRowKeys(newSelectedRowKeys);
    setProceedBtnDisplay(!proceedBtnDisplay);
  };

  const handleApprove = (): void => {
    navigate("/summary", {
      state: {
        invoiceRowData: invoicesData,
        breadCrumb: location.pathname,
        status: queryParam?.status || "pending",
        directoryId: directoryData?.id,
      },
    });
  };

  const onRowClick = (
    invoiceId: string,
    customInvoiceIdentifier: string
  ): void => {
    navigate("/invoiceReceipt", {
      state: {
        invoiceId: invoiceId,
        invoiceIdentifier: customInvoiceIdentifier,
        breadCrumb: location.pathname,
        directoryId: directoryData?.id,
      },
    });
  };

  const apiCallForInvoices = (searchParam: string): void => {
    setLoading(true);

    const invoicesQuery = `directoryId=${directoryData?.id}&${searchParam}`;
    dispatch(InvoicesApiCall(invoicesQuery))
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

  const tableRowSelectionOptions = {
    selections: [Table.SELECTION_ALL],
    getCheckboxProps: () => {
      return {
        disabled: false,
      };
    },
  };

  const rowApproveSelection: TableRowSelection<DataTypeForProjectInvoices> = {
    selectedRowKeys: selectedApproveRowKeys,
    onChange: onApproveSelectChange,
    ...tableRowSelectionOptions,
  };

  const rowPendingSelection: TableRowSelection<DataTypeForProjectInvoices> = {
    selectedRowKeys: selectedPendingRowKeys,
    onChange: onPendingSelectChange,
    ...tableRowSelectionOptions,
  };

  useEffect(() => {
    const searchParam = new URLSearchParams(location.search).toString();
    if (directoryData?.id) {
      if (searchParam) {
        apiCallForInvoices(searchParam);
      } else {
        apiCallForInvoices("status=pending");
      }
    }
  }, [location.search, projectParam, directoryData]);

  return (
    <>
      {(queryParam?.status === "pending" || !queryParam?.status) && (
        <>
          <Col>
            <Table
              rowSelection={rowPendingSelection}
              columns={columns}
              dataSource={invoicesData || []}
              pagination={false}
              loading={loading}
              scroll={{ y: 350 }}
              onRow={(record: DataTypeForProjectInvoices) => ({
                onClick: (): void =>
                  onRowClick(record?.id, record?.customInvoiceIdentifier),
              })}
              className="project-table-main"
              summary={(pageData) => {
                let totalToken = 0;
                let symbol;
                let tokenAmount: any = new bigDecimal(0);
                pageData.forEach(({ totalAmount = 0, tokenSymbol = "" }) => {
                  tokenAmount = tokenAmount.add(
                    new bigDecimal(totalAmount || 0)
                  );
                  symbol = tokenSymbol;
                });
                totalToken = tokenAmount.getValue();
                return (
                  <>
                    {totalToken != 0 && (
                      <Table.Summary.Row
                        style={{
                          fontSize: "16px",
                          fontWeight: "bold",
                        }}
                      >
                        <Table.Summary.Cell
                          index={0}
                          colSpan={3}
                          className="pending-invoice-total"
                        >
                          Total
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={1}>
                          {totalToken}
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={2}>
                          {symbol}
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    )}
                  </>
                );
              }}
            />
          </Col>
          <Col>
            <Button
              size="large"
              className={approveBtnCondition}
              disabled={approveBtnDisplay}
              onClick={handleApprove}
            >
              Approve
            </Button>
          </Col>
        </>
      )}
      {queryParam?.status === "approved" && (
        <>
          <Col>
            <Table
              rowSelection={rowApproveSelection}
              columns={columns}
              dataSource={invoicesData || []}
              pagination={false}
              loading={loading}
              scroll={{ y: 350 }}
              onRow={(record: DataTypeForProjectInvoices) => ({
                onClick: (): void =>
                  onRowClick(record?.id, record?.customInvoiceIdentifier),
              })}
              className="project-table-main"
            />
          </Col>
          <Col>
            <Button
              type="primary"
              size="large"
              className={proceedBtnPrimary}
              disabled={proceedBtnDisplay}
              onClick={handleApprove}
            >
              Proceed to Pay
            </Button>
          </Col>
        </>
      )}
      {queryParam?.status === "paid" && (
        <>
          <Col>
            <Table
              dataSource={invoicesData || []}
              columns={columns}
              loading={loading}
              pagination={false}
              scroll={{ y: 450 }}
              onRow={(record: DataTypeForProjectInvoices) => ({
                onClick: (): void =>
                  onRowClick(record?.id, record?.customInvoiceIdentifier),
              })}
              className="project-table-main"
              //rowSelection={rowApproveSelection}
            />
          </Col>
        </>
      )}
    </>
  );
};

export default InvoiceTable;
