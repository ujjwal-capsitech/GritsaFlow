import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
interface HomeState {
    selectedKey: string;

}
const initialState: HomeState = {
    selectedKey: '1',
};

const homeSlice = createSlice({
        name: "home",
        initialState,
        reducers: {
            setSelectedKey(state, action: PayloadAction<string>) {
                state.selectedKey = action.payload;
            },
        },
    });
export const { setSelectedKey } = homeSlice.actions;
export default homeSlice.reducer;