import { createSlice } from "@reduxjs/toolkit";
import { ApiState, ErrorState } from "./index.d";

export const INITIAL_API_STATE: ApiState = {
  data: null,
  error: null,
  isError: false,
  loading: true,
  flag: false,
};

const initialErrorState: ErrorState = {
  isError: false,
  error: null,
};

export const apiFailureSlice = createSlice({
  name: "commonApiError",
  initialState: initialErrorState,
  reducers: {
    apiFailure: (state, action) => {
      // eslint-disable-next-line no-console
      console.log({ state, action });
      state.error = action.payload;
      state.isError = true;
    },
    resetApiFailure: (state) => {
      state.error = null;
      state.isError = false;
    },
  },
});

export const apiFailureAction = apiFailureSlice.actions;

const apiFailureReducer = { apiFailureError: apiFailureSlice.reducer };
export default apiFailureReducer;
