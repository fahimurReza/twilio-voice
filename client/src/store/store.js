import { configureStore, createSlice } from "@reduxjs/toolkit";

const loadState = () => {
  try {
    const serializedCallHistory = localStorage.getItem("callHistory");
    const serializedBusinessNumbers = localStorage.getItem("businessNumbers");
    return {
      callHistory: serializedCallHistory
        ? JSON.parse(serializedCallHistory)
        : [],
      businessNumbers: serializedBusinessNumbers
        ? JSON.parse(serializedBusinessNumbers)
        : [],
    };
  } catch (err) {
    console.error("Failed to load state:", err);
    return { callHistory: [], businessNumbers: [] };
  }
};

const callSlice = createSlice({
  name: "calls",
  initialState: {
    callHistory: loadState().callHistory,
    businessNumbers: loadState().businessNumbers,
    rawInput: "",
    fromNumber: "",
    startCall: false,
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
      state.startCall = action.payload.startCall || false;
    },
    addBusinessNumber: (state, action) => {
      state.businessNumbers.push(action.payload);
      try {
        localStorage.setItem(
          "businessNumbers",
          JSON.stringify(state.businessNumbers)
        );
      } catch (err) {
        console.error("Failed to save business numbers:", err);
      }
    },
    removeBusinessNumber: (state, action) => {
      if (action.payload === undefined) {
        console.error("removeBusinessNumber: Index is undefined");
        return;
      }
      state.businessNumbers = state.businessNumbers.filter(
        (_, index) => index !== action.payload
      );
      try {
        localStorage.setItem(
          "businessNumbers",
          JSON.stringify(state.businessNumbers)
        );
      } catch (err) {
        console.error("Failed to save business numbers:", err);
      }
    },
  },
});

export const {
  addCall,
  removeCall,
  setCallInput,
  addBusinessNumber,
  removeBusinessNumber,
} = callSlice.actions;
export const store = configureStore({
  reducer: {
    calls: callSlice.reducer,
  },
});
