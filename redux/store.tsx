import {configureStore, combineReducers} from '@reduxjs/toolkit';
import userReducer from './userSlice';
import authReducer from './authSlice';
import loaderReducer from './loaderSlice';
import {persistStore, persistReducer} from 'redux-persist';
import { getPreference, setPreference, clearPreference } from '../network/userPreference';

const userPreferenceStorage = {
    getItem: async (key: string) => getPreference(key),
    setItem: async (key: string, value: string) => setPreference(key, value),
    removeItem: async (key: string) => clearPreference(key),
};

const persistConfig = {
    key : 'root',
    storage : userPreferenceStorage,
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