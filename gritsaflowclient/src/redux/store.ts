import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/LoginSlice"
import homeReducer from "./slice/HomeSlice";
import UserProfileSlice from "./slice/UserProfileSlice";



export const store = configureStore({
  reducer: {
        auth: authReducer,
        home: homeReducer,
        userProfile: UserProfileSlice,
  },
});
export type RootState = ReturnType<typeof store.getState>; //store.getstate returns the current state
export type AppDispatch = typeof store.dispatch; //sends action to redux store


