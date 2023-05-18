import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { checkIfLogin } from "../../utils/sessionManagement";
const AuthRoutes: React.FC = () => {
  const redirectUri = location.pathname + (location.search || "");
  const queryParam = new URLSearchParams({ redirectUri }).toString();
  return checkIfLogin() ? (
    <Outlet />
  ) : (
    <Navigate
      to={{
        pathname: "/login",
        search: `?${queryParam}`,
      }}
    />
  );
};

export default AuthRoutes;
