import React, { useState, useEffect } from "react";
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Row,
  Tooltip,
  Typography,
} from "antd";
import Icon, { CopyOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { generateKeyApiCall } from "./logic";
import { AppDispatch } from "../../store";
import { apiFailureAction } from "../../commonApiLogic";

const ApiCredentials: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [apiKey, setApiKey] = useState("");
  const { Link } = Typography;

  useEffect(() => {
    dispatch(generateKeyApiCall(""))
      .unwrap()
      .then(({ data }) => {
        setApiKey(data.data?.api_key);
      })
      .catch((err: Error) => {
        dispatch(apiFailureAction.apiFailure(err));
      });
  }, []);

  const copyToClipboard = (): void => {
    navigator.clipboard.writeText(apiKey).then(
      function () {
        message.success(" API key copied to clipboard");
      },
      function (err) {
        console.error("Async: Could not copy text: ", err);
      }
    );
  };

  return (
    <div>
      <Row className="profile-section form-row">
        <Col className="apikey-label">
          <p>API Key </p>
        </Col>
        <Col>
          <Input.Group className="apikey-input" compact>
            <Input.Password
              type="search"
              placeholder="Enter API key"
              size="large"
              defaultValue={apiKey}
              value={apiKey}
              className="border-less-input"
              disabled={true}
              visibilityToggle={false}
            />
            <Tooltip title="Copy API key">
              <Button
                icon={<CopyOutlined />}
                size="large"
                onClick={() => {
                  copyToClipboard();
                }}
                className="border-less-copy-btn"
              />
            </Tooltip>
          </Input.Group>
        </Col>
        <Col></Col>
      </Row>

      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        initialValues={{ remember: true }}
        autoComplete="off"
        layout="inline"
        className="profile-section"
      ></Form>

      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        initialValues={{ remember: true }}
        autoComplete="off"
        layout="inline"
        className="profile-section"
      ></Form>

      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        autoComplete="off"
        className="profile-section"
      >
        <Row>
          <Col>
            <Form.Item>
              <Link
                href="https://dev.invoices.perpetualblock.io/apidocs/"
                target="_blank"
              >
                <Button
                  // htmlType="submit"
                  size="large"
                  className="document-key-btn"
                  icon={
                    <Icon
                      component={() => (
                        <img src="/assets/images/documentation.svg" />
                      )}
                      style={{ textAlign: "right" }}
                    />
                  }
                >
                  Documentation
                </Button>
              </Link>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default ApiCredentials;
