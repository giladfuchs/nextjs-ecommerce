import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import cartReducer, { resetCartTransform } from "./cartSlice";

// ✅ Safely load `storage` only in the browser
const isBrowser = typeof window !== "undefined";

const createNoopStorage = () => ({
  getItem: (_key: string) => Promise.resolve(null),
  setItem: (_key: string, _value: string) => Promise.resolve(),
  removeItem: (_key: string) => Promise.resolve(),
});

const safeStorage = isBrowser
  ? require("redux-persist/lib/storage").default
  : createNoopStorage();

const rootReducer = combineReducers({
  cart: cartReducer,
});

const persistConfig = {
  key: "root",
  storage: safeStorage,
  whitelist: ["cart"],
  transforms: [resetCartTransform],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export function makeStore() {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
}

export type RootState = ReturnType<ReturnType<typeof makeStore>["getState"]>;
