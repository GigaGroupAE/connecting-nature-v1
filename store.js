import { configureStore } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistReducer } from "redux-persist";
import { combineReducers } from "redux";
import userSlice from "./src/slices/userSlice";
import postsSlice from "./src/slices/postsSlice";
import contactslice from "./src/slices/contactslice";
import upgradationRequestsSlice from "./src/slices/upgradationRequestsSlice";
import cartSlice from "./src/slices/cartSlice";

import { Api } from "./src/slices/Api";

const persistconfig = {
  key: "root",
  version: 1,
  storage: AsyncStorage,
  blacklist:[Api.reducerPath] // these reducers shall not be persisted
};

const RootReducer = combineReducers({
  user: userSlice,
  posts: postsSlice,
  contacts: contactslice,
  cart:cartSlice,
  upgradeRequests: upgradationRequestsSlice,
  
  [Api.reducerPath]:Api.reducer
});

const persistedReducer = persistReducer(persistconfig, RootReducer);




export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat([Api.middleware]),
});

export { RootReducer };
