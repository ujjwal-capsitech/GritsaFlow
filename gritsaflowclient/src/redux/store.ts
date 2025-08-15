import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/LoginSlice";
import homeReducer from "./slice/HomeSlice";
import userProfileReducer from "./slice/UserProfileSlice"; // Add this

const rootReducer = {
    auth: authReducer,
    home: homeReducer,
    userProfile: userProfileReducer, // Add this
};

export const store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;