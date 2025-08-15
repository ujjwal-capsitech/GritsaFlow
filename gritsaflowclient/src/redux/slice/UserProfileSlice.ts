import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";
import type { RootState } from "../store"; // Correct import

interface UserProfileState {
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
        avatarUrl?: string;
    } | null;
    loading: boolean;
    error: string | null;
}

const initialState: UserProfileState = {
    user: null,
    loading: false,
    error: null,
};

// Fetch current user
export const fetchUserProfile = createAsyncThunk(
    "userProfile/fetchUser",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("User/current");
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Error fetching user data");
        }
    }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
    "userProfile/updateUser",
    async (updatedData: any, { getState, rejectWithValue }) => {
        try {
            const state = getState() as RootState;
            const userId = state.userProfile.user?.id;

            if (!userId) {
                throw new Error("User ID not found");
            }

            const response = await api.put(`User/${userId}`, updatedData);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Error updating user");
        }
    }
);

const userProfileSlice = createSlice({
    name: "userProfile",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default userProfileSlice.reducer;
export const selectUserProfile = (state: RootState) => state.userProfile.user;
export const selectUserProfileLoading = (state: RootState) => state.userProfile.loading;
export const selectUserProfileError = (state: RootState) => state.userProfile.error;