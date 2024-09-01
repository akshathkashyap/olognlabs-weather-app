import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Locality {
    cityName: string;
    localityName: string;
    localityId: string;
    latitude: string;
    longitude: string;
    device_type: string;
}

interface LocalityState {
    locality: Locality | null;
}

const initialState: LocalityState = {
    locality: null
};

export const localitySlice = createSlice({
    name: "locality",
    initialState,
    reducers: {
        setLocality: (state, action: PayloadAction<Locality | null>) => {
            state.locality = action.payload;
        }
    }
})

export const { setLocality } = localitySlice.actions;
export default localitySlice.reducer;
