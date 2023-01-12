import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: {},
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    collectData : (state,action )=>{
      state.value=action.payload
    },
    logout: (state) => {
      state.value={}
    },
    modify: (state, action) => {
      state.value=action.payload
    },
    addImage: (state, action) => {
      state.value.imagePicture = action.payload;
    }
  },
});

export const {logout, collectData, modify ,addImage } = userSlice.actions;
export default userSlice.reducer;