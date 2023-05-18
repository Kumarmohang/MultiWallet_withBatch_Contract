import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Image,
  Modal,
  Form,
  Input,
  Row,
  Col,
  message,
  Typography,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { apiFailureAction } from "../../commonApiLogic";
import { AppDispatch, RootState } from "../../store";
import { headerUtils, session } from "../../utils";
import { loginApiCall, signupApiCall, UserCredentials } from "./logic";
import { checkIfLogin } from "../../utils/sessionManagement";
import { useLocation, useNavigate } from "react-router-dom";
import { ApiState } from "../../index.d";
import { blockchainDataConfigApiCall } from "../App/logic";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch: AppDispatch = useDispatch();
  const userLoginData: ApiState = useSelector(
    (state: RootState) => state.userLoginData
  );
  const [open, setOpen] = useState(false);
  const [openRegisterFrom, setOpenRegisterForm] = useState(false);
  const [openVerifyModal, setOpenVerifyModal] = useState(false);
  const [formRef] = Form.useForm();
  const queryParam = new URLSearchParams(location.search);
  const { Link } = Typography;

  const onRegister = (values: UserCredentials): void => {
    if (values.confirmPassword !== values.password) {
      message.error("Password & confirm password doesn't match !");
      return;
    }
    setOpenRegisterForm(false);
    setOpenVerifyModal(true);
    dispatch(signupApiCall(values))
      .unwrap()
      .then(({ data }) => {
        // eslint-disable-next-line no-console
        console.log(data);
      })
      .catch((err: Error) => {
        dispatch(apiFailureAction.apiFailure(err));
      });
    formRef.resetFields();
  };

  const onLogin = (values: UserCredentials): void => {
    dispatch(loginApiCall(values))
      .unwrap()
      .then(({ data }) => {
        session.addSession(data);
        headerUtils.setHeader(data.token);
        dispatch(blockchainDataConfigApiCall());
      })
      .catch((err: Error) => {
        dispatch(apiFailureAction.apiFailure(err));
      });
    formRef.resetFields();
  };

  useEffect(() => {
    if (userLoginData.flag) {
      queryParam.delete("oneTimeAccessToken");
      navigate({ search: queryParam.toString() });
      if (queryParam.has("redirectUri")) {
        navigate(`${queryParam.get("redirectUri")}`);
      } else {
        navigate("/");
      }
    }
  }, [userLoginData.flag]);

  useEffect(() => {
    if (checkIfLogin()) {
      queryParam.delete("oneTimeAccessToken");
      navigate({ search: queryParam.toString() });
      if (queryParam.has("redirectUri")) {
        navigate(`${queryParam.get("redirectUri")}`);
      } else {
        navigate("/");
      }
    }
  }, []);

  return (
    <>
      <div className="loginPage">
        <Row justify="space-between">
          <Col style={{ width: "80%", textAlign: "left" }}>
            <Image
              src={"/assets/images/Protean_Pay_SVG.svg"}
              alt="pic"
              preview={false}
              style={{ width: "80%" }}
            />
          </Col>
          <Col>
            <Row align="middle">
              <Col>
                <Image
                  src={"/assets/images/LoginProfile.png"}
                  alt="pic"
                  preview={false}
                />
              </Col>
              <Col className="login-btn-right">
                <div onClick={() => setOpen(true)}>
                  <span>Dashboard</span>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row justify="space-between" align="middle" className="section-1">
          <Col className="section-1-left" span={7}>
            <h3
              style={{
                color: "black",
                fontWeight: 1000,
                fontSize: 22,
              }}
            >
              ProteanPay
            </h3>
            <h3
              style={{
                color: "#db4743",
                fontSize: 35,
                fontWeight: 500,
              }}
            >
              Invoicing
            </h3>
            <h3
              style={{
                fontSize: 35,
                fontWeight: 1000,
                width: 300,
              }}
            >
              Pay and get paid in crypto
            </h3>
          </Col>
          <Col>
            <Image
              src={"/assets/images/Dashboard.png"}
              alt="Pic"
              preview={false}
            />
          </Col>
        </Row>
        <Row className="section-2" justify="space-between" align="middle">
          <Col>
            <Card
              cover={
                <Image
                  alt="pic"
                  src="/assets/images/WalletPayment.png"
                  preview={false}
                />
              }
              className="section-2-card no-border"
            >
              <Card.Meta
                title={
                  <span className="section-2-card-title">Quick Invoice</span>
                }
                description={
                  <span className="section-2-card-description">
                    Generate and share invoices and get paid in crypto in a few
                    steps
                  </span>
                }
                className="section-2-card-meta"
              ></Card.Meta>
            </Card>
          </Col>
          <Col>
            <Card
              cover={
                <Image
                  alt="pic"
                  src="/assets/images/QuickInvoice.png"
                  preview={false}
                />
              }
              className="section-2-card no-border"
            >
              <Card.Meta
                title={
                  <span className="section-2-card-title">Wallet Payment</span>
                }
                description={
                  <span className="section-2-card-description">
                    Choose to pay from wide range of wallets.We support all
                    major soft and hard crypto wallets.
                  </span>
                }
                className="section-2-card-meta"
              ></Card.Meta>
            </Card>
          </Col>
          <Col>
            <Card
              cover={
                <Image
                  alt="pic"
                  src="/assets/images/Analytics.png"
                  preview={false}
                />
              }
              className="section-2-card no-border"
            >
              <Card.Meta
                title={<span className="section-2-card-title">Analytics</span>}
                description={
                  <span className="section-2-card-description">
                    Monitor status of invoices , transactions , payables ,
                    receivables in a easy to use dashboard
                  </span>
                }
                className="section-2-card-meta"
              ></Card.Meta>
            </Card>
          </Col>
        </Row>
        <Row justify="space-between" align="middle" className="section-3">
          <Col>
            <Image src="/assets/images/Graph.png" alt="pic" preview={false} />
          </Col>
          <Col span={14}>
            <p className="section-3-content" style={{ width: 600 }}>
              As a merchant you can quickly look at summary of all transactions
              ,prices for all supportive crypto currencies and get priority
              support for tickets
            </p>
            <p className="section-3-content" style={{ width: 600 }}>
              The platform makes the whole invoicing process more efficient for
              all the parties involved while ensuring the accounting compliance
              set by our auditors.
            </p>
          </Col>
        </Row>
      </div>
      <Row justify="space-between" align="top" className="section-4">
        <Col span={4}>
          <Image
            src={"/assets/images/PerpetualBlockLogo.png"}
            alt="logo"
            className="company-logo"
            preview={false}
          />
        </Col>

        <Col span={8}>
          <Row justify="space-evenly">
            <Col>
              <Link
                href="https://www.perpetualblock.io/about-us/"
                target="_blank"
                style={{ color: "#484848", fontWeight: 800 }}
              >
                <p className="section-4-subheadings">About us</p>
              </Link>
            </Col>
            <Col>
              <Link
                href="https://www.perpetualblock.io/contact/"
                target="_blank"
                style={{ color: "#484848", fontWeight: 800 }}
              >
                <p className="section-4-subheadings">Contact Us</p>
              </Link>
            </Col>
          </Row>
        </Col>

        <Col span={6}>
          <p
            style={{ color: "#484848", fontWeight: 800 }}
            className="section-4-subheadings"
          >
            Perpetual Block AG, Gotthardstrasse 28, Postfach 7163, 6302 Zug,
            Switzerland
          </p>
        </Col>
      </Row>
      <Row className="bottom-section" align="middle">
        <Col>
          <p>Copyright 2022 | Perpetualblock AG | All Rights Reserved.</p>
        </Col>
      </Row>
      <Modal
        title={
          !openRegisterFrom ? (
            <div className="modal-title">
              <p>Welcome back</p>
              <h2>Login to your account</h2>
            </div>
          ) : (
            <div className="modal-title register">
              <h2>Register new user</h2>
            </div>
          )
        }
        centered
        open={open}
        onCancel={() => {
          setOpen(false);
          setOpenRegisterForm(false);
        }}
        footer={null}
        className="login-modal"
      >
        {!openRegisterFrom ? (
          <>
            <Form
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              initialValues={{ remember: true }}
              onFinish={onLogin}
              autoComplete="off"
              layout="vertical"
              className="modal-form"
              form={formRef}
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input your email!",
                    type: "email",
                  },
                ]}
              >
                <Input
                  size="large"
                  className="modal-login-input"
                  placeholder="Enter your email"
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    type: "regexp",
                    pattern: new RegExp(
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/
                    ),
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  className="modal-login-input"
                  placeholder="Enter your password"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  htmlType="submit"
                  size="large"
                  className="modal-login-btn"
                >
                  Login
                </Button>
              </Form.Item>
            </Form>
          </>
        ) : (
          <>
            <Form
              name="basic"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              initialValues={{ remember: true }}
              onFinish={onRegister}
              autoComplete="off"
              layout="vertical"
              className="modal-form"
              form={formRef}
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input valid email!",
                    type: "email",
                  },
                ]}
              >
                <Input
                  size="large"
                  className="modal-login-input"
                  placeholder="Enter your email"
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    type: "regexp",
                    pattern: new RegExp(
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/g
                    ),
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  className="modal-login-input"
                  placeholder="Enter your password"
                />
              </Form.Item>

              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                rules={[
                  { required: true, message: "Please confirm your password!" },
                ]}
              >
                <Input.Password
                  size="large"
                  className="modal-login-input"
                  placeholder="Re-enter your password"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  htmlType="submit"
                  size="large"
                  className="modal-login-btn"
                >
                  Register now
                </Button>
              </Form.Item>
            </Form>
            <p className="register-modal-footer">
              Verification link will be sent after registration.
            </p>
          </>
        )}
      </Modal>
      {openVerifyModal && (
        <Modal
          title={
            <div className="modal-title register">
              <h2>Verify your email !</h2>
            </div>
          }
          centered
          open={open}
          onCancel={() => {
            setOpen(false);
            setOpenRegisterForm(false);
            setOpenVerifyModal(false);
          }}
          footer={null}
          className="login-modal"
        >
          <p className="verify-modal-footer">
            An verification link is sent to your email address.Please check your
            email to complete the process.
          </p>
        </Modal>
      )}
    </>
  );
};

export default LoginPage;
