import { configureStore } from "@reduxjs/toolkit";
import localityReducer from "./features/weather/localitySlice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            weather: localityReducer
        }
    })
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
