import { ApiConfig, ApiState } from "./../../index.d";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../utils";
import { setFulFillState } from "../../utils/setStateUtils";

export interface FormFields {
  search: string;
  date?: string;
}

const API_CONFIG: ApiConfig = {
  GET_API_KEY: {
    url: "/users/me",
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

export const getMeApiCall = createAsyncThunk(
  "get/getMe",
  async (_getProjectListParam: string, { rejectWithValue }) => {
    try {
      const apiPayload = { ...API_CONFIG.GET_API_KEY };
      return await apiClient(apiPayload);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const getMeSlice = createSlice({
  name: "getMe",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getMeApiCall.pending, (state) => {
        state.loading = true;
        state.data = null;
        state.error = null;
        state.isError = false;
        state.flag = false;
      })
      .addCase(getMeApiCall.fulfilled, (state, action) => {
        setFulFillState(state, action);
      })
      .addCase(getMeApiCall.rejected, (state, action) => {
        state.loading = false;
        state.data = null;
        state.error = action.payload as object;
        state.isError = true;
        state.flag = false;
      });
  },
});

export const getMeAction = getMeSlice.actions;
const getMeReducer = {
  getMeData: getMeSlice.reducer,
};
export default getMeReducer;
