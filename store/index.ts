import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // uses localStorage

import cartReducer from './cartSlice';

const rootReducer = combineReducers({
    cart: cartReducer,
    // add other slices here
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['cart'], // ONLY persist cart
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // redux-persist needs this
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
