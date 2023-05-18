import React, { useState, useEffect } from "react";
import { Button, Col, Form, Input, Row } from "antd";
import { headerUtils, session } from "../../utils";
import { AppDispatch } from "../../store";
import { useDispatch } from "react-redux";
import { loginAction } from "../Login/logic";
import { useNavigate } from "react-router-dom";
import { getMeApiCall } from "./myProfileLogic";
import { apiFailureAction } from "../../commonApiLogic";
import { updateMeApiCall } from "./myProfileUpdateLogic";

const MyProfile: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [getMeData, setGetMeData] = useState<any>({});
  const [userData, setUserData] = useState<any>({});
  const [updatedUserData, setUpdatedUserData] = useState({});

  useEffect(() => {
    dispatch(getMeApiCall(""))
      .unwrap()
      .then(({ data }) => {
        setGetMeData(data.data);
      })
      .catch((err: Error) => {
        dispatch(apiFailureAction.apiFailure(err));
      });
  }, [updatedUserData]);

  const handleFormChange = (e: any): void => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleFormSubmit = (): void => {
    const postData = {
      firstname: userData.firstname,
      lastname: userData.lastname,
    };
    dispatch(updateMeApiCall(postData))
      .unwrap()
      .then(({ data }) => {
        setUpdatedUserData(data.data);
      })
      .catch((err: Error) => {
        dispatch(apiFailureAction.apiFailure(err));
      });
  };

  const onLogout = (): void => {
    session.clearSession();
    headerUtils.discardHeader();
    dispatch(loginAction.resetLogin());
    navigate("/login");
  };

  return (
    <Form
      name="basic"
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      autoComplete="off"
      layout="vertical"
      className="profile-section"
      onFinish={handleFormSubmit}
    >
      <Row>
        {getMeData.email && (
          <Col>
            <Form.Item label="First name" name="firstname">
              <Input
                name="firstname"
                size="large"
                className="myProfile-input"
                placeholder="Enter your firstname"
                value={userData.firstname || ""}
                onChange={handleFormChange}
                defaultValue={getMeData.firstname || ""}
              />
            </Form.Item>
          </Col>
        )}
      </Row>
      <Row>
        {getMeData.email && (
          <Col>
            <Form.Item label="Last name" name="lastname">
              <Input
                name="lastname"
                size="large"
                className="myProfile-input"
                placeholder="Enter your lastname"
                value={userData.lastname || ""}
                onChange={handleFormChange}
                defaultValue={getMeData.lastname || ""}
              />
            </Form.Item>
          </Col>
        )}
      </Row>
      <Row>
        <Col>
          {getMeData?.email && (
            <Form.Item label="Email Id" name="emailId">
              <Input
                size="large"
                className="myProfile-input"
                defaultValue={getMeData.email ? getMeData.email : ""}
                disabled={true}
                // placeholder="Enter your lastname"
              />
            </Form.Item>
          )}
        </Col>
      </Row>
      <Row>
        <Col span={4}>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="myProfile-btn-save"
            >
              Save My Information
            </Button>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col>
          <p className="btn-logout" onClick={onLogout}>
            Logout
          </p>
        </Col>
      </Row>
    </Form>
  );
};

export default MyProfile;
