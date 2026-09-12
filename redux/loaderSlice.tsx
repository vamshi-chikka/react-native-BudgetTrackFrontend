import {createSlice} from '@reduxjs/toolkit';

export const loaderSlice = createSlice({
    name:"loader",
    initialState:{
        isLoading: false,
        message: ''
    },
    reducers:{
        showLoader:(state, action) => {
            state.isLoading = true;
            state.message = action.payload || '';
        },
        hideLoader:(state) => {
            state.isLoading = false;
            state.message = '';
        }
    }
})
export const {showLoader, hideLoader} = loaderSlice.actions;
export default loaderSlice.reducer;