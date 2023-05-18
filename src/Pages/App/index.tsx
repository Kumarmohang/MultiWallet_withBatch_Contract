import { Layout, message, Space, Spin } from "antd";
import React, { Suspense, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ErrorState } from "../../index.d";
import { apiFailureAction } from "../../commonApiLogic";
import ErrorBoundary from "../../Components/ErrorBoundary";
import { AppDispatch, RootState } from "../../store";
import { loginAction } from "../Login/logic";
import { headerUtils, session } from "../../utils";
import AuthRoutes from "../../Components/AuthRoute";
import SideBar from "../../Components/Sidebar";
import { checkIfLogin, clearSession } from "../../utils/sessionManagement";
import { AxiosResponse } from "axios";
import { discardHeader } from "../../utils/apiClient";
import { blockchainDataConfigApiCall } from "./logic";

const Dashboard = React.lazy(() => import("../Dashboard"));
const ProjectInvoice = React.lazy(() => import("../Invoice/index"));
const InvoiceReceipt = React.lazy(() => import("../invoiceReceipt/index"));
const Summary = React.lazy(() => import("../Summary/index"));
const MyClient = React.lazy(() => import("../MyClient"));
const Invoice = React.lazy(() => import("../Invoice"));
const Login = React.lazy(() => import("../Login/index"));
const NotFound = React.lazy(() => import("../NotFound"));
const Payment = React.lazy(() => import("../Payment"));
const Profile = React.lazy(() => import("../Profile"));
const Transactions = React.lazy(() => import("../Transactions"));
const Settings = React.lazy(() => import("../Settings"));
const MyProfile = React.lazy(() => import("../Settings/myProfile"));
const CompanyProfile = React.lazy(() => import("../Settings/companyProfile"));
const ApiCredentials = React.lazy(() => import("../Settings/apiCredentials"));
const TransactionDetails = React.lazy(
  () => import("../TransactionDetails/index")
);

const App: React.FC = () => {
  const { isError, error = { message: "Something went wrong" } }: ErrorState =
    useSelector((state: RootState) => state.apiFailureError);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch: AppDispatch = useDispatch();
  const queryParam = new URLSearchParams(location.search);
  const notify = (response: AxiosResponse): void => {
    if (response.status === 401) {
      session.clearSession();
      headerUtils.discardHeader();
      dispatch(loginAction.resetLogin());
      if (location.pathname !== "/login") {
        navigate("/login");
        window.location.reload();
      }
      message.error("User Unauthorized");
    } else if (response.status === 504) {
      message.error("Request timeout");
    } else if (response.status === 400) {
      message.error(response.data.field?.[0].message || "Bad Request");
    } else if (response.status === 404) {
      message.error(response?.data?.message || "Record not found");
    }
  };
  useEffect(() => {
    message.config({
      top: 100,
      duration: 5,
      maxCount: 1,
      rtl: false,
    });
    const oneTimeAccessToken = queryParam.get("oneTimeAccessToken");
    const data: any = {
      expiresIn: 3600,
      token: oneTimeAccessToken,
    };

    if (oneTimeAccessToken) {
      clearSession();
      discardHeader();
      queryParam.delete("oneTimeAccessToken");
      navigate({ search: queryParam.toString() });
      dispatch(loginAction.updateLogin({ data }));
      session.addSession(data);
      headerUtils.setHeader(data.token);
    }

    if (checkIfLogin()) {
      dispatch(blockchainDataConfigApiCall());
    }
  }, []);

  useEffect(() => {
    if (isError) {
      const response = error.response;
      if (response) {
        notify(response);
      } else {
        message.error("Something went wrong please try again after some time");
      }
      dispatch(apiFailureAction.resetApiFailure());
    }
  }, [isError, error]);
  return (
    <div className="App">
      <ErrorBoundary>
        <Layout>
          {checkIfLogin() && <SideBar />}
          <Layout>
            <Layout.Content>
              <Suspense
                fallback={
                  <Space size="large" align="center">
                    <Spin size="large" />
                  </Space>
                }
              >
                <Routes>
                  <Route element={<AuthRoutes />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route
                      path="/directory/:identifier"
                      element={<ProjectInvoice />}
                    />
                    <Route
                      path="/invoiceReceipt"
                      element={<InvoiceReceipt />}
                    />
                    <Route path="/summary" element={<Summary />} />

                    <Route path="/myClient" element={<MyClient />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="/invoice" element={<Invoice />} />
                    <Route path="/payment" element={<Payment />} />
                    <Route path="/settings" element={<Settings />}>
                      <Route
                        path="/settings/myProfile"
                        element={<MyProfile />}
                      />
                      <Route
                        path="/settings/companyProfile"
                        element={<CompanyProfile />}
                      />
                      <Route
                        path="/settings/apiCredentials"
                        element={<ApiCredentials />}
                      />
                    </Route>
                    <Route
                      path="/transactions/:txnId"
                      element={<TransactionDetails />}
                    />
                  </Route>
                  <Route path="/login" element={<Login />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </Layout.Content>
          </Layout>
        </Layout>
      </ErrorBoundary>
    </div>
  );
};

export default App;
