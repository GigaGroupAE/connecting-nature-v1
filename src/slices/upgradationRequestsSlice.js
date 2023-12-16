import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { useSelector, shallowEqual } from "react-redux";
import { useActions } from "../hooks/useAction";

export const initialState = {
  requests: null,
};

export const upgradationRequestsSlice = createSlice({
  name: "upgradationRequests",
  initialState,
  reducers: {
    resetState: () => {
      return initialState;
    },
    setUpgradationRequests: (state, action) => {
      state.requests = action.payload.requests;
    },
  },
});

export const actions = upgradationRequestsSlice.actions;

export const useRequestsActions = () => useActions({ actions });

const upgradationRequestsSelector = (state) => state.user;
export const useUpgradationState = () =>
  useSelector(upgradationRequestsSelector, shallowEqual);

export default upgradationRequestsSlice.reducer;
