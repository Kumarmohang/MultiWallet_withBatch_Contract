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
  GET_PROJECT_LIST: {
    url: "/directory",
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

export const ProjectListApiCall = createAsyncThunk(
  "get/directory",
  async (getProjectListParam: string, { rejectWithValue }) => {
    try {
      const apiPayload = { ...API_CONFIG.GET_PROJECT_LIST };
      apiPayload.url += `?${getProjectListParam}`;
      const response = await apiClient(apiPayload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const projectListSlice = createSlice({
  name: "directory",
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(ProjectListApiCall.pending, (state) => {
        setPendingState(state);
      })
      .addCase(ProjectListApiCall.fulfilled, (state, action) => {
        setFulFillState(state, action);
      })
      .addCase(ProjectListApiCall.rejected, (state, action) => {
        setRejectedState(state, action);
      });
  },
});

export const projectListAction = projectListSlice.actions;
const projectListReducer = {
  projectListData: projectListSlice.reducer,
};
export default projectListReducer;
