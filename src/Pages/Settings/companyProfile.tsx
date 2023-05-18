import React, { useState, useEffect } from "react";
import { Button, Col, Form, Input, Row, Select } from "antd";
import { AppDispatch } from "../../store";
import { apiFailureAction } from "../../commonApiLogic";
import { getMeApiCall } from "./myProfileLogic";
import { useDispatch } from "react-redux";
import { updateMeApiCall } from "./myProfileUpdateLogic";

const CompanyProfile: React.FC = () => {
  const [formData, setFormData] = useState<any>({});

  const dispatch: AppDispatch = useDispatch();
  const [getMeAddFormatted, setMeAddFormatted] = useState<any>({});
  const [updatedUserData, setUpdatedUserData] = useState({});

  useEffect(() => {
    getMyAddressData();
  }, [updatedUserData]);

  const getMyAddressData = (): void => {
    dispatch(getMeApiCall(""))
      .unwrap()
      .then(({ data }) => {
        setMeAddFormatted({
          ...getMeAddFormatted,
          email: data?.data?.email,
          org_name: data?.data?.org_name ? data.data.org_name : "",
          address: data?.data?.address ? JSON.parse(data.data.address) : "",
        });
      })
      .catch((err: Error) => {
        dispatch(apiFailureAction.apiFailure(err));
      });
  };

  const updateMeAddressData = (postData: any): void => {
    dispatch(updateMeApiCall(postData))
      .unwrap()
      .then(({ data }) => {
        setUpdatedUserData(data.data);
      })
      .catch((err: Error) => {
        dispatch(apiFailureAction.apiFailure(err));
      });
  };

  const handleFormChange = (_e: any): void => {
    _e.preventDefault();
    const { name, value } = _e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (_e: any, field: any): void => {
    const { name, value } = field;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const getOrgName = (): any => {
    if (formData.org_name) {
      return formData.org_name;
    }
    return formData.org_name === ""
      ? formData.org_name
      : getMeAddFormatted.org_name;
  };
  const getAddress1 = (): any => {
    if (formData.address1) {
      return formData.address1;
    }
    return formData.address1 === ""
      ? formData.address1
      : getMeAddFormatted.address.address1;
  };
  const getAddress2 = (): any => {
    if (formData.address2) {
      return formData.address2;
    }
    return formData.address2 === ""
      ? formData.address2
      : getMeAddFormatted.address.address2;
  };
  const getstate = (): any => {
    if (formData.state) {
      return formData.state;
    }
    return formData.state === ""
      ? formData.state
      : getMeAddFormatted.address.state;
  };
  const getCountry = (): any => {
    if (formData.country) {
      return formData.country;
    }
    return formData.country === ""
      ? formData.country
      : getMeAddFormatted.address.country;
  };
  const getCity = (): any => {
    if (formData.city) {
      return formData.city;
    }
    return formData.city === ""
      ? formData.city
      : getMeAddFormatted.address.city;
  };
  const getPostalCode = (): any => {
    if (formData.postalCode) {
      return formData.postalCode;
    }
    return formData.postalCode === ""
      ? formData.postal
      : getMeAddFormatted.address.postalCode;
  };

  const handleFormSubmit = (): void => {
    const postDataPersistance: any = {
      org_name: getOrgName(),
      address1: getAddress1(),
      address2: getAddress2(),
      state: getstate(),
      country: getCountry(),
      city: getCity(),
      postalCode: getPostalCode(),
    };

    const keys = Object.keys(postDataPersistance);
    for (const key of keys) {
      if (!postDataPersistance[key]) {
        delete postDataPersistance[key];
      }
    }
    const postData: any = {
      org_name: postDataPersistance?.org_name || "",
      address: JSON.stringify(postDataPersistance),
    };
    updateMeAddressData(postData);
  };

  return (
    <div>
      {getMeAddFormatted.email && (
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          // onFinish={onLogin}
          autoComplete="off"
          layout="vertical"
          className="profile-section"
          onFinish={handleFormSubmit}
        >
          <Row>
            <Col>
              <Form.Item label="Add Company name" name="org_name">
                <Input
                  name="org_name"
                  onChange={handleFormChange}
                  size="large"
                  className="companyProfile-input"
                  placeholder="Enter company name"
                  value={formData.org_name || ""}
                  defaultValue={
                    getMeAddFormatted?.org_name
                      ? getMeAddFormatted.org_name
                      : ""
                  }
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[32, 0]}>
            <Col>
              <Form.Item label="Address Line 1" name="address1">
                <Input
                  name="address1"
                  onChange={handleFormChange}
                  size="large"
                  className="companyProfile-input"
                  placeholder="Enter address line 1"
                  value={formData.address1 || ""}
                  defaultValue={
                    getMeAddFormatted?.address?.address1
                      ? getMeAddFormatted.address.address1
                      : ""
                  }
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label="Address Line 2" name="address2">
                <Input
                  name="address2"
                  onChange={handleFormChange}
                  size="large"
                  className="companyProfile-input"
                  placeholder="Enter address line 2"
                  value={formData.address2 || ""}
                  defaultValue={
                    getMeAddFormatted?.address?.address2
                      ? getMeAddFormatted.address.address2
                      : ""
                  }
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[32, 0]}>
            <Col>
              <Form.Item label="State" name="state">
                <Select
                  size="large"
                  onChange={handleSelectChange}
                  placeholder="Select your state"
                  className="companyProfile-input"
                  value={formData.state || ""}
                  defaultValue={
                    getMeAddFormatted?.address?.state
                      ? getMeAddFormatted.address.state
                      : ""
                  }
                >
                  <Select.Option
                    key="Maharashtra"
                    name="state"
                    value="Maharashtra"
                  >
                    Maharashtra
                  </Select.Option>
                  <Select.Option key="Karnataka" name="state" value="Karnataka">
                    Karnataka
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label="Country" name="country">
                <Select
                  size="large"
                  onChange={handleSelectChange}
                  placeholder="Select your country"
                  className="companyProfile-input"
                  value={formData.country || ""}
                  defaultValue={
                    getMeAddFormatted?.address?.country
                      ? getMeAddFormatted.address.country
                      : ""
                  }
                >
                  <Select.Option key="Indial" name="country" value="India">
                    India
                  </Select.Option>
                  <Select.Option key="USA" name="country" value="USA">
                    USA
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[32, 0]}>
            <Col>
              <Form.Item label="City" name="city">
                <Input
                  name="city"
                  onChange={handleFormChange}
                  size="large"
                  className="companyProfile-input"
                  placeholder="Enter city name"
                  value={formData.city || ""}
                  defaultValue={
                    getMeAddFormatted?.address?.city
                      ? getMeAddFormatted.address.city
                      : ""
                  }
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item label="Postal Code" name="postalCode">
                <Input
                  name="postalCode"
                  onChange={handleFormChange}
                  size="large"
                  className="companyProfile-input"
                  placeholder="Enter postal code"
                  value={formData.postalCode}
                  defaultValue={
                    getMeAddFormatted?.address?.postalCode
                      ? getMeAddFormatted.address.postalCode
                      : ""
                  }
                />
              </Form.Item>
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
            <Col></Col>
          </Row>
        </Form>
      )}
    </div>
  );
};

export default CompanyProfile;
