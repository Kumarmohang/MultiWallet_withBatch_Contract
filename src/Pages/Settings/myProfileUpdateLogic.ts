import { ApiConfig, ApiState } from "./../../index.d";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../utils";
import { setFulFillState } from "../../utils/setStateUtils";

export interface FormFields {
  search: string;
  date?: string;
}

const API_CONFIG: ApiConfig = {
  UPDATE_ME: {
    url: "/users/me",
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

export const updateMeApiCall = createAsyncThunk(
  "put/updateMe",
  async (userData: any, { rejectWithValue }) => {
    try {
      const apiPayload = { ...API_CONFIG.UPDATE_ME };
      apiPayload.data = userData;
      return await apiClient(apiPayload);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const updateMeSlice = createSlice({
  name: "updateMe",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(updateMeApiCall.pending, (state) => {
        state.loading = true;
        state.data = null;
        state.error = null;
        state.isError = false;
        state.flag = false;
      })
      .addCase(updateMeApiCall.fulfilled, (state, action) => {
        setFulFillState(state, action);
      })
      .addCase(updateMeApiCall.rejected, (state, action) => {
        state.loading = false;
        state.data = null;
        state.error = action.payload as object;
        state.isError = true;
        state.flag = false;
      });
  },
});

export const updateAction = updateMeSlice.actions;
const updateMeReducer = {
  updateMeData: updateMeSlice.reducer,
};
export default updateMeReducer;
