
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { RoleEnum } from "../../api/Role";

interface AuthState {
    isLogin: boolean;
    role: RoleEnum | null;
    tokenExpiry: string | null;
    user: {
        name: string;
        email: string;
        avatarUrl?: string;
    } | null;
}

const initialState: AuthState = {
    isLogin: localStorage.getItem("isLogin") === "true",
    role: (localStorage.getItem("Role") as RoleEnum) || null,
    tokenExpiry: localStorage.getItem("tokenExpiry") || null,
    user: JSON.parse(localStorage.getItem("user") || 'null'),
};

const AuthSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<AuthState['user']>) =>
        {
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload));
        },
        setIsLogin: (state, action: PayloadAction<boolean>) => {
            state.isLogin = action.payload;
        },
        setRole: (state, action: PayloadAction<RoleEnum>) => {
            state.role = action.payload;
        },
        setTokenExpiry: (state, action: PayloadAction<string | null>) => {
            state.tokenExpiry = action.payload;
        },
        logout: (state) => {
            state.isLogin = false;
            state.role = null;
            state.tokenExpiry = null;
            state.user = null;
            localStorage.clear();
            document.cookie = "accessToken=; Max-Age=0; path=/";
            document.cookie = "refreshToken=; Max-Age=0; path=/";
        },

    },
});

export const { setUser,setIsLogin, setRole, setTokenExpiry, logout } = AuthSlice.actions;
export default AuthSlice.reducer;

