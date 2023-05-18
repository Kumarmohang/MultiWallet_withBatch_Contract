import React, { useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Col, Form, Input, Row, Button } from "antd";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { FormFields } from "./logic";

interface FuncProps {
  propOnSearch: (val: string) => void;
}

const TransactionForm: React.FC<FuncProps> = ({
  propOnSearch,
}): JSX.Element => {
  const location = useLocation();
  const [formRef] = Form.useForm();

  function getQueryData(): object {
    const searchQuery = queryString.parse(location.search);
    const initialValues = {} as any;
    if (searchQuery.search) {
      initialValues.search = searchQuery.search;
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
    if (!searchParam.has("status")) {
      searchParam.set("status", "pending");
    }
    propOnSearch(searchParam.toString());
  };

  useEffect(() => {
    formRef.setFieldsValue(getQueryData());
  }, []);

  return (
    <Form onFinish={handleSubmit} form={formRef}>
      <Row gutter={4}>
        <Col span={12}>
          <Form.Item label="" name="search">
            <Input
              type="search"
              placeholder="Search Directory"
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
      </Row>
    </Form>
  );
};

export default TransactionForm;
