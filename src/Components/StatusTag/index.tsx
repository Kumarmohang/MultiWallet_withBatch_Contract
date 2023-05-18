import React from "react";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Tag } from "antd";

const STATUS_MAPPING = {
  initiated: {
    icon: <SyncOutlined />,
    text: "Initiated",
    type: "processing",
  },
  complete: { icon: <CheckCircleOutlined />, text: "Paid", type: "success" },
  failed: { icon: <CloseCircleOutlined />, text: "Failed", type: "error" },
  pending: {
    icon: <ClockCircleOutlined />,
    text: "Pending",
    type: "warning",
  },
};

interface StatusTagProps {
  status: "initiated" | "complete" | "failed" | "pending";
}

const StatusTag: React.FC<StatusTagProps> = ({ status }) => {
  const statusObj = STATUS_MAPPING[status];

  return (
    <Tag icon={statusObj.icon} color={statusObj.type}>
      {statusObj.text}
    </Tag>
  );
};

export default StatusTag;
