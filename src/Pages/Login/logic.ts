import { ApiConfig, ApiState } from "./../../index.d";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../../utils";
import {
  setFulFillState,
  setPendingState,
  setRejectedState,
  setResetState,
} from "../../utils/setStateUtils";

export interface UserCredentials {
  email: string;
  password: string;
  confirmPassword?: string;
}

const API_CONFIG: ApiConfig = {
  POST_LOGIN: {
    method: "POST",
    data: {},
    url: "/login/",
  },
  POST_SIGNUP: {
    method: "POST",
    data: {},
    url: "/signup/",
  },
};

const loginInitialState: ApiState = {
  loading: false,
  isError: false,
  data: null,
  error: {},
  flag: false,
};
const signupInitialState: ApiState = {
  loading: false,
  isError: false,
  data: null,
  error: {},
  flag: false,
};

export const loginApiCall = createAsyncThunk(
  "post/login",
  async (userData: UserCredentials, { rejectWithValue }) => {
    try {
      const apiPayload = { ...API_CONFIG.POST_LOGIN };
      apiPayload.data = userData;
      const response = await apiClient(apiPayload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const signupApiCall = createAsyncThunk(
  "post/signup",
  async (userData: UserCredentials, { rejectWithValue }) => {
    try {
      const apiPayload = { ...API_CONFIG.POST_SIGNUP };
      apiPayload.data = userData;
      const response = await apiClient(apiPayload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const loginSlice = createSlice({
  name: "login",
  initialState: loginInitialState,
  reducers: {
    resetLogin: (state) => {
      setResetState(state);
    },
    updateLogin: (state, action) => {
      state.data = action.payload;
      state.error = null;
      state.flag = true;
      state.isError = false;
      state.loading = false;
    },
  },

  extraReducers(builder) {
    builder
      .addCase(loginApiCall.pending, (state) => {
        setPendingState(state);
      })
      .addCase(loginApiCall.fulfilled, (state, action) => {
        setFulFillState(state, action);
      })
      .addCase(loginApiCall.rejected, (state, action) => {
        setRejectedState(state, action);
      });
  },
});

const signupSlice = createSlice({
  name: "login",
  initialState: signupInitialState,
  reducers: {
    resetSignup: (state) => {
      setResetState(state);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(signupApiCall.pending, (state) => {
        setPendingState(state);
      })
      .addCase(signupApiCall.fulfilled, (state, action) => {
        setFulFillState(state, action);
      })
      .addCase(signupApiCall.rejected, (state, action) => {
        setRejectedState(state, action);
      });
  },
});

export const loginAction = loginSlice.actions;
export const signupAction = signupSlice.actions;
const loginReducer = {
  userLoginData: loginSlice.reducer,
  userSignupData: signupSlice.reducer,
};

export default loginReducer;
