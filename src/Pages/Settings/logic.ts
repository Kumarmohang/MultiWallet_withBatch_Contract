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
  GET_API_KEY: {
    url: "/users/me/api_key",
    method: "GET",
    data: {},
  },
  UPDATE_API_KEY: {
    url: "/users/me/api_key",
    method: "PUT",
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

const updateApiKeyinitialState: ApiState = {
  loading: false,
  isError: false,
  data: null,
  error: {},
  flag: false,
};

export const generateKeyApiCall = createAsyncThunk(
  "get/generateKey",
  async (_getProjectListParam: string, { rejectWithValue }) => {
    try {
      const apiPayload = { ...API_CONFIG.GET_API_KEY };
      return await apiClient(apiPayload);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateKeyApiCall = createAsyncThunk(
  "put/updateKey",
  async (_getProjectListParam: string, { rejectWithValue }) => {
    try {
      const apiPayload = { ...API_CONFIG.UPDATE_API_KEY };
      return await apiClient(apiPayload);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const generateKeySlice = createSlice({
  name: "generateKey",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(generateKeyApiCall.pending, (state) => {
        setPendingState(state);
      })
      .addCase(generateKeyApiCall.fulfilled, (state, action) => {
        setFulFillState(state, action);
      })
      .addCase(generateKeyApiCall.rejected, (state, action) => {
        setRejectedState(state, action);
      });
  },
});

const updateKeySlice = createSlice({
  name: "updateKey",
  initialState: updateApiKeyinitialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(updateKeyApiCall.pending, (state) => {
        setPendingState(state);
      })
      .addCase(updateKeyApiCall.fulfilled, (state, action) => {
        setFulFillState(state, action);
      })
      .addCase(updateKeyApiCall.rejected, (state, action) => {
        setRejectedState(state, action);
      });
  },
});

export const generateKeyAction = generateKeySlice.actions;
export const updateKeyAction = updateKeySlice.actions;
const generateKeyReducer = {
  generateKeyData: generateKeySlice.reducer,
  updateKeyData: updateKeySlice.reducer,
};
export default generateKeyReducer;
