import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: {
    date: [""],
  },
};

export const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    collectDate: (state, action) => {
      state.value.date.push(action.payload);
    },
    deleteDate: (state, action) => {
      state.value.date = state.value.date.filter(
        (item) => item.id !== action.payload
      );
    },
  },
});

export const { collectDate, deleteDate } = bookSlice.actions;
export default bookSlice.reducer;
