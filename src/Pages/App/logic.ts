import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../utils";
import {
  setFulFillState,
  setPendingState,
  setRejectedState,
  setResetState,
} from "../../utils/setStateUtils";
import { ApiConfig, ApiState } from "./../../index.d";

const API_CONFIG: ApiConfig = {
  GET_BLOCKCHAIN_DATA: {
    method: "GET",
    data: {},
    url: "/blockchainConfig/blockchain",
  },
};

const initialState: ApiState = {
  loading: false,
  isError: false,
  data: null,
  error: {},
  flag: false,
};

export const blockchainDataConfigApiCall = createAsyncThunk(
  "/get/blockchainConfig",
  async (_, { rejectWithValue }) => {
    try {
      const apiPayload = { ...API_CONFIG.GET_BLOCKCHAIN_DATA };
      const response = await apiClient(apiPayload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const blochainDataConfigSlice = createSlice({
  name: "blockchainConfig",
  initialState: initialState,
  reducers: {
    resetblockchainData: (state) => {
      setResetState(state);
    },
    updateBlockchainConfig: (state, action) => {
      state.data = action.payload;
      state.error = null;
      state.flag = true;
      state.isError = false;
      state.loading = false;
    },
  },

  extraReducers(builder) {
    builder
      .addCase(blockchainDataConfigApiCall.pending, (state) => {
        setPendingState(state);
      })
      .addCase(blockchainDataConfigApiCall.fulfilled, (state, action) => {
        setFulFillState(state, action);
      })
      .addCase(blockchainDataConfigApiCall.rejected, (state, action) => {
        setRejectedState(state, action);
      });
  },
});

export const blockchainConfig = blochainDataConfigSlice.actions;

const blockchainConfigReducer = {
  blockchainConfigData: blochainDataConfigSlice.reducer,
};

export default blockchainConfigReducer;
