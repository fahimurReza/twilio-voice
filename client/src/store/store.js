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
  initialState: { callHistory: loadState() },
  reducers: {
    addCall: (state, action) => {
      state.callHistory.push(action.payload);
      // Save to localStorage
      try {
        localStorage.setItem("callHistory", JSON.stringify(state.callHistory));
      } catch (err) {
        console.error("Failed to save call history:", err);
      }
    },
  },
});

export const { addCall } = callSlice.actions;
export const store = configureStore({
  reducer: {
    calls: callSlice.reducer,
  },
});
