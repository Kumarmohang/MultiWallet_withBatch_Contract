import React, { useEffect, useState } from "react";
import { Image, Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import { createBrowserHistory } from "history";
import { MenuInfo } from "rc-menu/lib/interface";

type historyObj = {
  key: string;
  pathname: string;
  search: string;
};

type SideBarMenuItem = {
  name: string;
  path: string;
  title: string;
  iconPath: string;
  isActive: (item: historyObj) => boolean;
};

const sidebarList: SideBarMenuItem[] = [
  {
    name: "Directories",
    path: "/",
    title: "Directories",
    iconPath: "/assets/images/DirectoryIcon.svg",
    isActive: (location) =>
      location.pathname === "/" ||
      location.pathname.includes("/directory") ||
      location.pathname.includes("/directory/:identifier") ||
      location.pathname.includes("/summary") ||
      location.pathname.includes("/invoiceReceipt"),
  },
  {
    name: "Past Transactions",
    path: "/transactions",
    title: "Past transactions",
    iconPath: "/assets/images/Transaction_Black.svg",
    isActive: (location) =>
      location.pathname === "/transactions" ||
      location.pathname.includes("/transactions"),
  },
];

const { Sider: AntdSider } = Layout;

const SideBar: React.FC = () => {
  const history = createBrowserHistory();

  const getActiveKey = (): string[] => {
    return sidebarList
      .filter((ele) => ele.isActive(history.location))
      .map((ele) => ele.path);
  };

  const [activeMenuItem, setActiveMenuItem] = useState<string[]>(
    getActiveKey()
  );

  const renderSidebarMenu = (): JSX.Element[] => {
    return sidebarList.map((ele) => {
      const isActive = ele.isActive(history.location);
      return (
        <Menu.Item
          key={ele.path}
          title={ele.title}
          role="presentation"
          icon={<img src={ele.iconPath} alt="icon" />}
          className={`nav-item${isActive ? " active" : ""} active subItems`}
        >
          <Link
            to={ele.path}
            style={{
              textDecoration: "none",
              fontSize: "16px",
              paddingLeft: "10px",
              color: "black",
            }}
          >
            {ele.name}
          </Link>
        </Menu.Item>
      );
    });
  };

  const navigateTo = ({ key }: MenuInfo): void => {
    history.push(key);
    setActiveMenuItem(getActiveKey());
  };

  useEffect(() => {
    if (history.location.pathname) {
      setActiveMenuItem(getActiveKey());
    }
  }, [history.location.pathname]);

  return (
    <AntdSider
      breakpoint="md"
      collapsed={false}
      width="18%"
      className="sidebar"
    >
      <div className="logo">
        <Image
          src="/assets/images/Protean_Pay_SVG.svg"
          alt="logo"
          preview={false}
          style={{ width: "80%", marginTop: "7%" }}
        />
      </div>
      <Menu
        theme="light"
        mode="inline"
        onClick={navigateTo}
        selectedKeys={activeMenuItem}
        className="sidebar-menu"
      >
        {renderSidebarMenu()}
      </Menu>
    </AntdSider>
  );
};

export default SideBar;
