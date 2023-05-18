import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../utils";
import { ApiConfig, ApiState } from "../../index.d";
import {
  setFulFillPayloadState,
  setFulFillState,
  setPendingState,
  setRejectedState,
} from "../../utils/setStateUtils";

export interface FormFields {
  search: string;
}

const API_CONFIG: ApiConfig = {
  GET_TRANSACTION_DETAIL: {
    method: "GET",
    url: "/transaction/details",
    data: {},
  },
  GET_TRANSACTION_INVOICES_DATA: {
    method: "GET",
    url: "/transaction/invoices",
    data: {},
  },
  GENERATE_PAYMENT_RECEIPET: {
    url: "/transaction/getTransactionPdf",
    method: "GET",
    data: {},
  },
};

const initialStateForTransaction: ApiState = {
  loading: false,
  isError: false,
  data: null,
  error: {},
  flag: false,
};

const initialState: ApiState = {
  loading: false,
  isError: false,
  data: null,
  error: {},
  flag: false,
};

const initialReceiptState: ApiState = {
  loading: false,
  isError: false,
  data: null,
  error: {},
  flag: false,
};

export const transactionDetailApiCall = createAsyncThunk(
  "get/transactionDetail",
  async (getTransactionDetailParam: string, { rejectWithValue }) => {
    try {
      const apiPayload = { ...API_CONFIG.GET_TRANSACTION_DETAIL };
      apiPayload.url += `?txnId=${getTransactionDetailParam}`;
      return await apiClient(apiPayload);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const TransactionInvoicesApiCall = createAsyncThunk(
  "get/transactionInvoices",
  async (getProjectParam: string, { rejectWithValue }) => {
    try {
      const apiPayload = { ...API_CONFIG.GET_TRANSACTION_INVOICES_DATA };
      apiPayload.url += `?${getProjectParam}`;
      const response = await apiClient(apiPayload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const GenerateRecieptPdfApiCall = createAsyncThunk(
  "/transaction/getTransactionPdf",
  async (getPaymentReceiptParam: any, { rejectWithValue }) => {
    try {
      const apiPayload = { ...API_CONFIG.GENERATE_PAYMENT_RECEIPET };
      apiPayload.url += `?txnId=${getPaymentReceiptParam}`;
      return await apiClient({
        ...apiPayload,
        responseType: "arraybuffer",
      });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const transactionDetailSlice = createSlice({
  name: "transactionDetail",
  initialState: initialStateForTransaction,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(transactionDetailApiCall.pending, (state) => {
        setPendingState(state);
      })
      .addCase(transactionDetailApiCall.fulfilled, (state, action) => {
        setFulFillPayloadState(state, action);
      })
      .addCase(transactionDetailApiCall.rejected, (state, action) => {
        setRejectedState(state, action);
      });
  },
});

const invoicesSlice = createSlice({
  name: "transactionInvoices",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(TransactionInvoicesApiCall.pending, (state) => {
        setPendingState(state);
      })
      .addCase(TransactionInvoicesApiCall.fulfilled, (state, action) => {
        setFulFillState(state, action);
      })
      .addCase(TransactionInvoicesApiCall.rejected, (state, action) => {
        setRejectedState(state, action);
      });
  },
});

const generatePdfSlice = createSlice({
  name: "receiptpdf",
  initialState: initialReceiptState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(GenerateRecieptPdfApiCall.pending, (state) => {
        setPendingState(state);
      })
      .addCase(GenerateRecieptPdfApiCall.fulfilled, (state, action) => {
        setFulFillState(state, action);
      })
      .addCase(GenerateRecieptPdfApiCall.rejected, (state, action) => {
        setRejectedState(state, action);
      });
  },
});

export const InvoicesAction = invoicesSlice.actions;
export const transactionDetailAction = transactionDetailSlice.actions;
export const paymentReceiptAction = generatePdfSlice.actions;

const transactionDetails = {
  transactionDetailData: transactionDetailSlice.reducer,
  transactionInvoicesData: invoicesSlice.reducer,
  generatePdfData: generatePdfSlice.reducer,
};

export default transactionDetails;
