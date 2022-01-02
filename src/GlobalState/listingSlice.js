import { createSlice } from '@reduxjs/toolkit';
import {getListing, getNftSalesHistory} from "../core/api";

const listingSlice = createSlice({
    name: 'listing',
    initialState: {
        loading: false,
        error: false,
        listing: null,
        history: [],
    },
    reducers: {
        listingLoading: (state) => {
            state.loading = true;
        },
        listingReceived: (state, action) => {
            state.loading = false;
            state.listing = action.payload.listing;
            state.history = action.payload.history ?? [];
        }
    },
});

export const { listingLoading, listingReceived } = listingSlice.actions;

export default listingSlice.reducer;

export const getListingDetails = (listingId) => async (dispatch) => {
    dispatch(listingLoading());
    const listing = await getListing(listingId);
    const history = await getNftSalesHistory(listing.nftAddress, listing.nftId);
    dispatch(listingReceived({listing, history}));
}