import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { apiFailureAction } from "../../commonApiLogic";
import { AppDispatch } from "../../store";
import InvoiceReceiptHeader from "./invoiceReceiptHeader";
import { InvoiceReceiptApiCall } from "./logic";
import Invoice from "./Invoice";

const InvoiceReceipt: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [invoiceReceiptData, setInvoiceReceiptData] = useState<any>({});
  const locationState = useLocation().state as {
    invoiceId: string;
    invoiceIdentifier: string;
    breadCrumb: string;
    directoryId: string;
  };

  const [loading, setLoading] = useState(true);

  // eslint-disable-next-line no-console

  const apiCallForInvoiceReceipt = (): void => {
    setLoading(true);
    dispatch(InvoiceReceiptApiCall(locationState?.invoiceIdentifier))
      .unwrap()
      .then(({ data }) => {
        setInvoiceReceiptData(data);
        setLoading(false);
        console.log(data);
      })
      .catch((err: Error) => {
        dispatch(apiFailureAction.apiFailure(err));
        setLoading(false);
      });
  };

  useEffect(() => {
    apiCallForInvoiceReceipt();
  }, []);

  return (
    <div className="summary">
      <InvoiceReceiptHeader
        breadCrumb={locationState?.breadCrumb}
        invoiceIdentifier={locationState?.invoiceIdentifier}
      />
      {loading ? (
        <Spin size="large" />
      ) : (
        <Invoice invoiceHtml={invoiceReceiptData.invoiceHtml} />
      )}
    </div>
  );
};

export default InvoiceReceipt;
