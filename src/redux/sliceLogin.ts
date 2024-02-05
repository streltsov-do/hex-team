import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IntLogin {
    access_token: string;
    token_type: string;
}

const initialValue: IntLogin = {
    access_token: "",
    token_type: "",
};

function initStateLogin() {
    const localData: string | null = localStorage.getItem("auth");

    let initial = initialValue;

    if (typeof localData === "string") {
        const data: IntLogin = JSON.parse(localData);

        initial = data;
    }

    return initial;
}

const initialState: IntLogin = initStateLogin();

const sliceLogin = createSlice({
    name: "login",
    initialState,
    reducers: {
        AUTH(state, action: PayloadAction<IntLogin>) {
            state = action.payload;
            return state;
        },
        LOGOUT(state) {
            state = initialValue;
            return state;
        },
    },
});

export const { AUTH, LOGOUT } = sliceLogin.actions;

export default sliceLogin.reducer;
