import { createSlice } from '@reduxjs/toolkit';
import { getNft } from "../core/api";

const nftSlice = createSlice({
    name: 'nft',
    initialState: {
        loading: false,
        error: false,
        nft: null,
    },
    reducers: {
        nftLoading: (state) => {
            state.loading = true;
            state.error = false;
        },
        nftReceived: (state, action) => {
            state.loading = false;
            state.error = false;
            state.nft = action.payload;
        }
    },
});

export const { nftLoading, nftReceived } = nftSlice.actions;

export default nftSlice.reducer;

export const getNftDetails = (collectionId, nftId) => async (dispatch, getState) => {
    dispatch(nftLoading());
    const nft = await getNft(collectionId, nftId);
    console.log('----');
    console.log(nft)
    dispatch(nftReceived(nft));
}