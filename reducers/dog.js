import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // value: { email: null,  infoUser: "" },
  value: {},
};

export const dogSlice = createSlice({
  name: 'dog',
  initialState,
  reducers: {
    collectData : (state,action )=> {
      state.value=action.payload
    },
    modify: (state, action) => {
      state.value=action.payload
    }
  },
});

export const { collectData, modify } = dogSlice.actions;
export default dogSlice.reducer;