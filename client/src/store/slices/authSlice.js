import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    authSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    authFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload ?? null;
    },
    clearError: (state) => {
      state.error = null;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
    },
    updateUser: (state, action) => {
      state.user = { ...(state.user || {}), ...(action.payload || {}) };
    },
  },
  extraReducers: (builder) => {
    // Ensure error and loading are never restored from stale persisted state on rehydration
    builder.addCase("persist/REHYDRATE", (state, action) => {
      if (action.payload?.auth) {
        state.user = action.payload.auth.user ?? null;
        state.token = action.payload.auth.token ?? null;
        state.loading = false;
        state.error = null;
      }
    });
  },
});

export const { authStart, authSuccess, authFailure, clearError, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
