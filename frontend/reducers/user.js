import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // value: { email: null,  infoUser: "" },
  value: {},
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    collectData : (state,action )=>{

      state.value=action.payload
    },
    login: (state, action) => {
      state.value.token = action.payload.token;
      state.value.email = action.payload.email;
      state.value.nom = action.payload.nom;
      state.value.password = action.payload.password;
      state.value.code_creche = action.payload.code_creche;
    },
    logout: (state) => {
      state.value={}
    },
    modify: (state, action) => {
      state.value=action.payload
    }, 
    addPhoto: (state, action) => {
      state.value.photos =action.payload.photos;
    }, 
  },
});

export const { login, logout, collectData, modify, addPhoto} = userSlice.actions;
export default userSlice.reducer;