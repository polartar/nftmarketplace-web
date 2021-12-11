import { createSlice } from '@reduxjs/toolkit';
import { getListing } from "../core/api";

const listingSlice = createSlice({
    name: 'listing',
    initialState: {
        loading: false,
        error: false,
        listing: null,
    },
    reducers: {
        listingLoading: (state) => {
            state.loading = true;
            state.error = false;
        },
        listingReceived: (state, action) => {
            state.loading = false;
            state.error = false;
            state.listing = action.payload;
        }
    },
});

export const { listingLoading, listingReceived } = listingSlice.actions;

export default listingSlice.reducer;

export const getListingDetails = (listingId) => async (dispatch, getState) => {
    dispatch(listingLoading());
    const listing = await getListing(listingId);
    dispatch(listingReceived(listing));
}