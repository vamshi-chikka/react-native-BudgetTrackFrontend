import {configureStore, combineReducers} from '@reduxjs/toolkit';
import userReducer from './userSlice';
import authReducer from './authSlice';
import loaderReducer from './loaderSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistStore, persistReducer} from 'redux-persist';

const persistConfig = {
    key : 'root',
    storage : AsyncStorage,
    whitelist : ['auth', 'user'],
    timeout: 12000,
}

const rootReducer = combineReducers({
    user : userReducer,
    auth : authReducer,
    loader : loaderReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ 
        serializableCheck: false,
        immutableCheck: false 
    }),
})

export const persistor = persistStore(store);