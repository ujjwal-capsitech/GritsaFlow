// redux/slices/LoginSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { RoleEnum } from "../../api/Role";

interface AuthState {
    isLogin: boolean;
    Role: RoleEnum | null;
    tokenExpiry: string | null;
}

const initialState: AuthState = {
    isLogin: localStorage.getItem("isLogin") === "true",
    Role: (localStorage.getItem("Role") as RoleEnum) || null,
    tokenExpiry: localStorage.getItem("tokenExpiry") || null,
};

const AuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setIsLogin: (state, action: PayloadAction<boolean>) => {
            state.isLogin = action.payload;
        },
        setRole: (state, action: PayloadAction<RoleEnum>) => {
            state.Role = action.payload;
        },
        setTokenExpiry: (state, action: PayloadAction<string | null>) => {
            state.tokenExpiry = action.payload;
        },
        logout: (state) => {
            state.isLogin = false;
            state.Role = null;
            state.tokenExpiry = null;
            localStorage.clear();
            document.cookie = "accessToken=; Max-Age=0; path=/";
            document.cookie = "refreshToken=; Max-Age=0; path=/";
        },
    },
});

export const { setIsLogin, setRole, setTokenExpiry, logout } = AuthSlice.actions;
export default AuthSlice.reducer;
