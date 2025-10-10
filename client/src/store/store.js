import { configureStore, createSlice } from "@reduxjs/toolkit";

// Load initial state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("callHistory");
    return serializedState ? JSON.parse(serializedState) : [];
  } catch (err) {
    console.error("Failed to load call history:", err);
    return [];
  }
};

const callSlice = createSlice({
  name: "calls",
  initialState: {
    callHistory: loadState(),
    rawInput: "",
    fromNumber: "",
    startCall: false, // CHANGE: Add startCall flag to trigger auto-call
  },
  reducers: {
    addCall: (state, action) => {
      state.callHistory.push(action.payload);
      try {
        localStorage.setItem("callHistory", JSON.stringify(state.callHistory));
      } catch (err) {
        console.error("Failed to save call history:", err);
      }
    },
    removeCall: (state, action) => {
      if (action.payload === undefined) {
        console.error("removeCall: Index is undefined");
        return;
      }
      state.callHistory = state.callHistory.filter(
        (_, index) => index !== action.payload
      );
      try {
        localStorage.setItem("callHistory", JSON.stringify(state.callHistory));
      } catch (err) {
        console.error("Failed to save call history:", err);
      }
    },
    setCallInput: (state, action) => {
      state.rawInput = action.payload.phoneNumber || "";
      state.fromNumber = action.payload.fromNumber || "";
      state.startCall = action.payload.startCall || false; // CHANGE: Set startCall from payload
    },
  },
});

export const { addCall, removeCall, setCallInput } = callSlice.actions;
export const store = configureStore({
  reducer: {
    calls: callSlice.reducer,
  },
});
