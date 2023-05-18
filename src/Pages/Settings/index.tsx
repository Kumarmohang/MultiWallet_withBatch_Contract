import React, { useEffect, useState } from "react";
import { Breadcrumb, Col, Row, Tabs } from "antd";
import { TabItemForProjectList } from "../../index.d";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Logout from "../../Components/Logout";
import ApiCredentials from "./apiCredentials";

const TabItems: TabItemForProjectList[] = [
  {
    label: `API Credentials`,
    key: "apiCredentialTab",
    path: "/settings/apiCredentials",
    routeName: "apiCredentials",
  },
];

const Settings: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState(TabItems[0].key);

  const onChange = (key: string): void => {
    const activeTab = TabItems.find((item) => item.key === key);
    setActiveKey(key);
    navigate(`${activeTab?.path}`);
  };

  const renderBreadcrumbItem = (): JSX.Element | string => {
    const pathSnippets = location.pathname.split("/").filter((i) => i);

    const activeItem = TabItems.find((item) =>
      pathSnippets.includes(item.routeName)
    );

    if (activeItem) {
      return (
        <Breadcrumb.Item key={activeItem.key} className="project-crumbItem">
          {activeItem.label}
        </Breadcrumb.Item>
      );
    } else {
      return "";
    }
  };

  useEffect(() => {
    const pathSnippets = location.pathname.split("/").filter((i) => i);
    const activeItem = TabItems.find((item) =>
      pathSnippets.includes(item.routeName)
    );
    if (activeItem) {
      setActiveKey(activeItem.key);
    }
  }, []);

  return (
    <div className="settingPage">
      <Row justify="space-between" className="project-header" align="middle">
        <Col>
          <Breadcrumb separator=">">
            <Breadcrumb.Item key="project_1" className="project-crumbItem">
              Settings
            </Breadcrumb.Item>
            {renderBreadcrumbItem()}
          </Breadcrumb>
        </Col>
        <Col className="myProfile">
          <Row align="middle">
            <Col className="myProfile-subHeadings">
              <span>Hi</span>
            </Col>
            <Col className="myProfile-subHeadings">
              <Logout />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="profile-tabs">
        <Col>
          <Tabs
            activeKey={activeKey}
            size="large"
            tabBarGutter={100}
            onChange={onChange}
            items={TabItems}
            className="profile-active-tabs"
          />
        </Col>
      </Row>

      {location.pathname === "/settings" ||
      location.pathname === "/settings/myProfile" ? (
        <ApiCredentials />
      ) : (
        <Outlet />
      )}
    </div>
  );
};

export default Settings;
