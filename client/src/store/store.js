import { configureStore, createSlice } from "@reduxjs/toolkit";

const loadState = () => {
  try {
    const serializedCallHistory = localStorage.getItem("callHistory");
    const serializedBusinesses = localStorage.getItem("businesses");
    return {
      callHistory: serializedCallHistory
        ? JSON.parse(serializedCallHistory)
        : [],
      businesses: serializedBusinesses ? JSON.parse(serializedBusinesses) : [],
    };
  } catch (err) {
    console.error("Failed to load state:", err);
    return { callHistory: [], businesses: [] };
  }
};

const callSlice = createSlice({
  name: "calls",
  initialState: {
    callHistory: loadState().callHistory,
    businesses: loadState().businesses,
    inputValue: "",
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
      state.inputValue = action.payload.phoneNumber || "";
      state.fromNumber = action.payload.fromNumber || "";
      state.startCall = action.payload.startCall || false;
    },
    addBusiness: (state, action) => {
      state.businesses.push(action.payload);
      try {
        localStorage.setItem("businesses", JSON.stringify(state.businesses));
      } catch (err) {
        console.error("Failed to save businesses:", err);
      }
    },
    removeBusiness: (state, action) => {
      if (action.payload === undefined) {
        console.error("removeBusiness: Index is undefined");
        return;
      }
      state.businesses = state.businesses.filter(
        (_, index) => index !== action.payload
      );
      try {
        localStorage.setItem("businesses", JSON.stringify(state.businesses));
      } catch (err) {
        console.error("Failed to save businesses:", err);
      }
    },
  },
});

export const {
  addCall,
  removeCall,
  setCallInput,
  addBusiness,
  removeBusiness,
} = callSlice.actions;
export const store = configureStore({
  reducer: {
    calls: callSlice.reducer,
  },
});
