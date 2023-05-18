import React, { useEffect, useState } from "react";
import { Col, Form, Input, Row, Button, DatePicker, Tabs } from "antd";
import { DownloadOutlined, SearchOutlined } from "@ant-design/icons";
import { TabItemForProject } from "../../index.d";
import { FormFields } from "./logic";
import queryString from "query-string";
import { useLocation } from "react-router-dom";

const { RangePicker } = DatePicker;

interface FuncProps {
  propOnSearch: (val: string) => void;
}

const TabItems: TabItemForProject[] = [
  {
    label: "Pending Invoices",
    key: "pendingInvoiceTab",
    path: "/directories/:projectId/pendingInvoice",
    routeName: "pendingInvoice",
    status: "pending",
  },
  {
    label: "Approved",
    key: "approvedInvoiceTab",
    path: "/directories/:projectId/approvedInvoice",
    routeName: "approvedInvoice",
    status: "approved",
  },
  {
    label: "Paid",
    key: "paidInvoiceTab",
    path: "/directories/:projectId/paidInvoice",
    routeName: "paidInvoice",
    status: "paid",
  },
];

function setPendingStatus(searchParam: URLSearchParams): void {
  if (!searchParam.has("status")) {
    searchParam.set("status", "pending");
  }
}

function deleteParams(
  searchParam: URLSearchParams,
  paramsList: string[]
): void {
  for (const param of paramsList) {
    searchParam.delete(param);
  }
}

const InvoiceForm: React.FC<FuncProps> = ({ propOnSearch }) => {
  const location = useLocation();
  const [activeKey, setActiveKey] = useState(TabItems[0].key);
  const [formRef] = Form.useForm();
  const queryParam = queryString.parse(location.search);

  const onDateChange = (values: any | null): void => {
    const searchParam = new URLSearchParams(location.search);
    deleteParams(searchParam, ["dateFrom", "dateTo"]);
    if (values && values.length) {
      searchParam.set("dateFrom", values[0]?.format("DD-MM-YYYY"));
      searchParam.set("dateTo", values[1]?.format("DD-MM-YYYY"));
      propOnSearch(searchParam.toString());
    } else {
      propOnSearch(searchParam.toString());
    }
  };

  const onTabChange = (key: string): void => {
    const searchParam = new URLSearchParams(location.search);
    const activeTab = TabItems.find((item) => item.key === key);
    if (activeTab) {
      deleteParams(searchParam, ["status", "dateFrom", "dateTo"]);
      searchParam.set("status", activeTab?.status);
    }
    setActiveKey(key);
    propOnSearch(searchParam.toString());
  };

  function getQueryData(): object {
    const searchQuery = queryString.parse(location.search);
    const initialValues = {} as any;
    if (searchQuery.search) {
      initialValues.search = searchQuery.search;
    }
    if (searchQuery.dateFrom) {
      initialValues.dateFrom = searchQuery.dateFrom;
    }
    if (searchQuery.dateTo) {
      initialValues.dateTo = searchQuery.dateTo;
    }

    return initialValues;
  }

  const handleSubmit = (values: FormFields): void => {
    const { search } = values;
    const searchParam = new URLSearchParams(location.search);
    if (search) {
      searchParam.set("search", search);
    } else {
      searchParam.delete("search");
    }
    setPendingStatus(searchParam);

    propOnSearch(searchParam.toString());
  };

  useEffect(() => {
    formRef.setFieldsValue(getQueryData());
    const searchParam = new URLSearchParams(location.search);

    if (queryParam.status) {
      const activeItem = TabItems.find(
        (item) => item.status === queryParam.status
      );
      setActiveKey(`${activeItem?.key}`);
    }
    if (queryParam.status === "pending" || queryParam.status === "approved") {
      deleteParams(searchParam, ["dateFrom", "dateTo"]);
    }
    setPendingStatus(searchParam);
    propOnSearch(searchParam.toString());
  }, []);

  return (
    <>
      <Form onFinish={handleSubmit} form={formRef}>
        <Row gutter={4}>
          <Col span={12}>
            <Form.Item label="" name="search">
              <Input
                type="search"
                placeholder="Search invoice"
                size="large"
                style={{ borderRadius: "5px" }}
              />
            </Form.Item>
          </Col>
          <Col span={1}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              icon={<SearchOutlined />}
            ></Button>
          </Col>
          <Col span={11} style={{ textAlign: "right" }}>
            <Button
              type="primary"
              htmlType="button"
              size="large"
              icon={<DownloadOutlined />}
              className="download-invoices-btn"
            >
              Download Invoices
            </Button>
          </Col>
        </Row>
      </Form>

      <Row justify="space-between" align="middle">
        <Col>
          <Tabs
            activeKey={activeKey}
            size="large"
            tabBarGutter={150}
            onChange={onTabChange}
            items={TabItems}
            className="project-table-tabs"
          />
        </Col>
        <Col span={4}>
          <RangePicker
            picker="date"
            format={"DD-MM-YYYY"}
            size="large"
            onChange={onDateChange}
            className="project-table-date"
          />
        </Col>
      </Row>
    </>
  );
};

export default InvoiceForm;
