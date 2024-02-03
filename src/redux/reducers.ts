import { configureStore } from "@reduxjs/toolkit";
import sliceLogin from "./sliceLogin";

export const store = configureStore({
    reducer: {
        login: sliceLogin,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
