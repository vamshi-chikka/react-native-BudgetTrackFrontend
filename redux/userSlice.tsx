import {createSlice} from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name:"user",
    initialState:{
        user:null,
        error: null,
    },
    reducers:{
       userLogin:(state,action)=>{
            state.user = action.payload;
            state.error = null;
       },
       userLogout:(state)=>{
            state.user = null;
            state.error = null;
       },
       setError:(state, action)=>{
            state.error = action.payload;
       }
    }
})

export const {userLogin,userLogout, setError} = userSlice.actions;
export default userSlice.reducer;