import React from "react";

interface InvoiceProps {
  invoiceHtml: string;
}

const Invoice: React.FC<InvoiceProps> = (props) => {
  return (
    <div>
      <iframe
        srcDoc={props.invoiceHtml}
        style={{ minWidth: "90%", height: "80vh" }}
      ></iframe>
    </div>
  );
};

export default Invoice;
