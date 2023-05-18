import apiFailureReducer from "../commonApiLogic";
import blockchainConfigReducer from "../Pages/App/logic";
import projectListReducer from "../Pages/Dashboard/logic";
import invoicesReducer from "../Pages/Invoice/logic";
import invoiceReceiptReducer from "../Pages/invoiceReceipt/logic";
import loginReducer from "../Pages/Login/logic";
import generateKeyReducer from "../Pages/Settings/logic";
import getMeReducer from "../Pages/Settings/myProfileLogic";
import updateMeReducer from "../Pages/Settings/myProfileUpdateLogic";
import summaryStatusReducer from "../Pages/Summary/logic";
import transactionDetails from "../Pages/TransactionDetails/logic";
import transactionListReducer from "../Pages/Transactions/logic";

export const combinedReducers = {
  ...loginReducer,
  ...apiFailureReducer,
  ...projectListReducer,
  ...invoicesReducer,
  ...invoiceReceiptReducer,
  ...generateKeyReducer,
  ...summaryStatusReducer,
  ...getMeReducer,
  ...updateMeReducer,
  ...transactionListReducer,
  ...transactionDetails,
  ...blockchainConfigReducer,
};
