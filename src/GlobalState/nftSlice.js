import { createSlice } from '@reduxjs/toolkit';
import {getNft, getNftNew} from "../core/api";

const nftSlice = createSlice({
    name: 'nft',
    initialState: {
        loading: false,
        error: false,
        nft: null,
        listings: [],
    },
    reducers: {
        nftLoading: (state) => {
            state.loading = true;
            state.error = false;
        },
        nftReceived: (state, action) => {
            state.loading = false;
            state.error = false;
            state.nft = action.payload.nft;
            state.listings = action.payload.listings;
        }
    },
});

export const { nftLoading, nftReceived } = nftSlice.actions;

export default nftSlice.reducer;

export const getNftDetails = (collectionId, nftId) => async (dispatch, getState) => {
    dispatch(nftLoading());
    const nft = await getNftNew(collectionId, nftId);
    dispatch(nftReceived(nft));
}