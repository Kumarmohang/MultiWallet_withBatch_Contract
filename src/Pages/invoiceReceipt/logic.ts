import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../utils";
import {
  setFulFillState,
  setPendingState,
  setRejectedState,
} from "../../utils/setStateUtils";
import { ApiState, DummyApiConfig, DummyApiResponse } from "./../../index.d";

export interface FormFields {
  search: string;
  date?: string;
}

const API_CONFIG: DummyApiConfig /* ApiConfig */ = {
  GET_INVOICE_RECEIPT: {
    url: "/invoice/html",
    method: "GET",
    data: {},
  },
  GENERATE_INVOICE: {
    url: "/invoice/getInvoicePdf",
    method: "GET",
    data: {},
  },
};

const initialState: ApiState = {
  loading: false,
  isError: false,
  data: null,
  error: {},
  flag: false,
};

export const InvoiceReceiptApiCall = createAsyncThunk(
  "get/invoiceReceipt",
  async (getInvoiceReceiptParam: string, { rejectWithValue }) => {
    try {
      const apiPayload = { ...API_CONFIG.GET_INVOICE_RECEIPT };
      apiPayload.url += `?customInvoiceIdentifier=${getInvoiceReceiptParam}`;
      const response: DummyApiResponse = await apiClient(apiPayload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const GeneratePdfApiCall = createAsyncThunk(
  "get/invoicepdf",
  async (getInvoiceReceiptParam: string, { rejectWithValue }) => {
    try {
      const apiPayload = { ...API_CONFIG.GENERATE_INVOICE };
      apiPayload.url += `?customInvoiceIdentifier=${getInvoiceReceiptParam}`;
      const response: DummyApiResponse = await apiClient({
        ...apiPayload,
        responseType: "arraybuffer",
      });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const invoiceReceiptSlice = createSlice({
  name: "directory",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(InvoiceReceiptApiCall.pending, (state) => {
        setPendingState(state);
      })
      .addCase(InvoiceReceiptApiCall.fulfilled, (state, action) => {
        setFulFillState(state, action);
      })
      .addCase(InvoiceReceiptApiCall.rejected, (state, action) => {
        setRejectedState(state, action);
      });
  },
});

const generatePdfSlice = createSlice({
  name: "generatePDF",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(GeneratePdfApiCall.pending, (state) => {
        setPendingState(state);
      })
      .addCase(GeneratePdfApiCall.fulfilled, (state, action) => {
        setFulFillState(state, action);
      })
      .addCase(GeneratePdfApiCall.rejected, (state, action) => {
        setRejectedState(state, action);
      });
  },
});

export const invoiceReceiptAction = invoiceReceiptSlice.actions;
const invoiceReceiptReducer = {
  invoiceReceiptData: invoiceReceiptSlice.reducer,
  generatePdfData: generatePdfSlice.reducer,
};
export default invoiceReceiptReducer;
