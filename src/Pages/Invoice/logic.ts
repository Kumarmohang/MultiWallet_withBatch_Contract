import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../utils";
import {
  setFulFillPayloadState,
  setFulFillState,
  setPendingState,
  setRejectedState,
} from "../../utils/setStateUtils";
import { ApiConfig, ApiState } from "./../../index.d";

export interface FormFields {
  search: string;
}

const API_CONFIG: ApiConfig = {
  GET_DIRECTORY_DETAIL: {
    method: "GET",
    url: "/directory/details",
    data: {},
  },
  GET_INVOICES_DATA: {
    method: "GET",
    url: "/invoice",
    data: {},
  },
};

const initialStateForDirectory: ApiState = {
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

export const directoryDetailApiCall = createAsyncThunk(
  "get/directoryDetail",
  async (getDirectoryDetailParam: string, { rejectWithValue }) => {
    try {
      const apiPayload = { ...API_CONFIG.GET_DIRECTORY_DETAIL };
      apiPayload.url += `?customDirectoryIdentifier=${getDirectoryDetailParam}`;
      return await apiClient(apiPayload);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const InvoicesApiCall = createAsyncThunk(
  "get/invoices",
  async (getProjectParam: string, { rejectWithValue }) => {
    try {
      const apiPayload = { ...API_CONFIG.GET_INVOICES_DATA };
      apiPayload.url += `?${getProjectParam}`;
      const response = await apiClient(apiPayload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const directoryDetailSlice = createSlice({
  name: "directoryDetail",
  initialState: initialStateForDirectory,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(directoryDetailApiCall.pending, (state) => {
        setPendingState(state);
      })
      .addCase(directoryDetailApiCall.fulfilled, (state, action) => {
        setFulFillPayloadState(state, action);
      })
      .addCase(directoryDetailApiCall.rejected, (state, action) => {
        setRejectedState(state, action);
      });
  },
});

const invoicesSlice = createSlice({
  name: "invoices",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(InvoicesApiCall.pending, (state) => {
        setPendingState(state);
      })
      .addCase(InvoicesApiCall.fulfilled, (state, action) => {
        setFulFillState(state, action);
      })
      .addCase(InvoicesApiCall.rejected, (state, action) => {
        setRejectedState(state, action);
      });
  },
});

export const InvoicesAction = invoicesSlice.actions;
export const directoryDetailAction = directoryDetailSlice.actions;

const invoicesReducer = {
  directoryDetailData: directoryDetailSlice.reducer,
  invoicesData: invoicesSlice.reducer,
};

export default invoicesReducer;
