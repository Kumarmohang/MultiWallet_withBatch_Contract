import { ApiConfig, ApiState } from "./../../index.d";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../utils";
import {
  setFulFillState,
  setPendingState,
  setRejectedState,
} from "../../utils/setStateUtils";

export interface FormFields {
  search: string;
  date?: string;
}

const API_CONFIG: ApiConfig = {
  GET_TRANSACTION_LIST: {
    url: "/transaction",
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

export const TransactionListApiCall = createAsyncThunk(
  "get/directory",
  async (getTransactionListParam: string, { rejectWithValue }) => {
    try {
      const apiPayload = { ...API_CONFIG.GET_TRANSACTION_LIST };
      if (getTransactionListParam !== "") {
        apiPayload.url += `?${getTransactionListParam}`;
      }
      const response = await apiClient(apiPayload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const transactionListSlice = createSlice({
  name: "directory",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(TransactionListApiCall.pending, (state) => {
        setPendingState(state);
      })
      .addCase(TransactionListApiCall.fulfilled, (state, action) => {
        setFulFillState(state, action);
      })
      .addCase(TransactionListApiCall.rejected, (state, action) => {
        setRejectedState(state, action);
      });
  },
});

export const transactionListAction = transactionListSlice.actions;
const transactionListReducer = {
  transactionListData: transactionListSlice.reducer,
};
export default transactionListReducer;
