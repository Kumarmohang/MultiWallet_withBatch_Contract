import { ApiConfig, ApiState, updateStatusBody } from "../../index.d";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import apiClient from "../../utils";
import {
  setFulFillPayloadState,
  setFulFillState,
  setPendingState,
  setRejectedState,
  setResetState,
} from "../../utils/setStateUtils";

export interface FormFields {
  search: string;
  date?: string;
}

export interface WalletReducerState {
  isWalletConnected?: boolean;
  publicWalletAddress?: string;
  chainId?: number | string;
}

const API_CONFIG: ApiConfig = {
  GET_APPROVE_STATUS: {
    url: "/invoice/updateStatusAll",
    method: "POST",
    data: {},
  },
  INITIATE_TRANSACTION: {
    url: "/transaction/initiate",
    method: "POST",
    data: {},
  },
  UPDATE_TRANSACTION: {
    url: "/transaction/update",
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

const initialCryptoWalletState: WalletReducerState = {
  isWalletConnected: false,
  publicWalletAddress: "",
  chainId: 0,
};

export const ApproveStatusApiCall = createAsyncThunk(
  "get/approveStatus",
  async (payload: updateStatusBody, { rejectWithValue }) => {
    try {
      const apiPayload = { ...API_CONFIG.GET_APPROVE_STATUS };
      apiPayload.url += `?directoryId=${payload.directoryId}`;
      apiPayload.data = payload;
      const response = await apiClient(apiPayload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const initiateTxApiCall = createAsyncThunk(
  "/transaction/initiate",
  async (data: any, { rejectWithValue }) => {
    try {
      const apiPayload = { ...API_CONFIG.INITIATE_TRANSACTION };
      apiPayload.data = data;
      return await apiClient(apiPayload);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateTxApiCall = createAsyncThunk(
  "/transaction/update",
  async (data: any, { rejectWithValue }) => {
    try {
      const apiPayload = { ...API_CONFIG.UPDATE_TRANSACTION };
      apiPayload.data = data;
      return await apiClient(apiPayload);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const walletStateSlice = createSlice({
  name: "walletState",
  initialState: initialCryptoWalletState,
  reducers: {
    updatePublicWalletAddress: (state, action: PayloadAction<string>) => {
      state.publicWalletAddress = action.payload;
    },
    updateChainId: (state, action: PayloadAction<number | string>) => {
      state.chainId = action.payload;
    },
    updateWalletConnectionState: (state, action: PayloadAction<boolean>) => {
      state.isWalletConnected = action.payload;
    },
    resetWalletConnectionState: (state) => {
      state.isWalletConnected = false;
      state.publicWalletAddress = "";
      state.chainId = 0;
    },
  },
});

export const approveStatusSlice = createSlice({
  name: "approveStatus",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(ApproveStatusApiCall.pending, (state) => {
        setPendingState(state);
      })
      .addCase(ApproveStatusApiCall.fulfilled, (state, action) => {
        setFulFillState(state, action);
      })
      .addCase(ApproveStatusApiCall.rejected, (state, action) => {
        setRejectedState(state, action);
      });
  },
});

export const initiateTxSlice = createSlice({
  name: "initiateTx",
  initialState: initialState,
  reducers: {
    resetInitiateTxState: (state) => {
      setResetState(state);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(initiateTxApiCall.pending, (state) => {
        setPendingState(state);
      })
      .addCase(initiateTxApiCall.fulfilled, (state, action) => {
        setFulFillPayloadState(state, action);
      })
      .addCase(initiateTxApiCall.rejected, (state, action) => {
        setRejectedState(state, action);
      });
  },
});

const updateTxSlice = createSlice({
  name: "updateTx",
  initialState: initialState,
  reducers: {
    resetUpdateTxState: (state) => {
      setResetState(state);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(updateTxApiCall.pending, (state) => {
        setPendingState(state);
      })
      .addCase(updateTxApiCall.fulfilled, (state, action) => {
        setFulFillPayloadState(state, action);
      })
      .addCase(updateTxApiCall.rejected, (state, action) => {
        setRejectedState(state, action);
      });
  },
});

export const approveStatusAction = approveStatusSlice.actions;
export const walletStateAction = walletStateSlice.actions;
export const initiateTxAction = initiateTxSlice.actions;
export const updateTxAction = updateTxSlice.actions;

const summaryStatusReducer = {
  approveStatusData: approveStatusSlice.reducer,
  walletStateData: walletStateSlice.reducer,
  initiateTxData: initiateTxSlice.reducer,
  updateTxData: updateTxSlice.reducer,
};
export default summaryStatusReducer;
