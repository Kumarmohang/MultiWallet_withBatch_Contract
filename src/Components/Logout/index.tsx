import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { headerUtils, session } from "../../utils";
import { loginAction } from "../../Pages/Login/logic";
import { useDispatch } from "react-redux";

const Logout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onLogout = (): void => {
    session.clearSession();
    headerUtils.discardHeader();
    dispatch(loginAction.resetLogin());
    navigate("/login");
  };
  return (
    <Button
      type="primary"
      size="large"
      className="project-btn"
      style={{ background: "#005cf6", borderRadius: "5px" }}
      onClick={onLogout}
    >
      Logout
    </Button>
  );
};

export default Logout;
