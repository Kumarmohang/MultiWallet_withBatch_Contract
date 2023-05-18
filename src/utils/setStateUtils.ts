import { ApiState } from "../index.d";

export function setPendingState(state: ApiState): void {
  state.loading = true;
  state.data = null;
  state.error = null;
  state.isError = false;
  state.flag = false;
}

export function setFulFillState(state: ApiState, action: any): void {
  state.loading = false;
  state.data = action.payload;
  state.error = null;
  state.isError = false;
  state.flag = true;
}

export function setRejectedState(state: ApiState, action: any): void {
  state.loading = false;
  state.data = null;
  state.error = action.payload as object;
  state.isError = true;
  state.flag = false;
}

export function setResetState(state: ApiState): void {
  state.loading = false;
  state.data = null;
  state.error = null;
  state.flag = false;
  state.isError = false;
}

export function setFulFillPayloadState(state: ApiState, action: any): void {
  state.loading = false;
  state.data = action.payload.data.data;
  state.error = null;
  state.isError = false;
  state.flag = true;
}
