import { createSlice } from '@reduxjs/toolkit';
import {getAuction, getListing, getNft, getNftSalesHistory} from "../core/api";

const auctionSlice = createSlice({
    name: 'listing',
    initialState: {
        loading: false,
        error: false,
        auction: null,
        nft: null,
        history: [],
        bidHistory: [],
        powertraits: [],
    },
    reducers: {
        auctionLoading: (state) => {
            state.loading = true;
        },
        auctionReceived: (state, action) => {
            state.loading = false;
            state.auction = action.payload.listing;
            state.history = action.payload.history ?? [];
            state.bidHistory = action.payload.listing.bidHistory ?? [];
            state.powertraits = action.payload.powertraits ?? [];
        },
        auctionUpdated: (state, action) => {
            state.listing = action.payload.listing;
        }
    },
});

export const { auctionLoading, auctionReceived, auctionUpdated } = auctionSlice.actions;

export default auctionSlice.reducer;

export const getAuctionDetails = (auctionId) => async (dispatch) => {
    dispatch(auctionLoading());
    const listing = await getAuction(auctionId);
    const nft = await getNft(listing.nftAddress, listing.nftId, false);
    const history = nft?.listings ?? [];
    const powertraits = nft.nft?.powertraits ?? [];
    dispatch(auctionReceived({listing, history, powertraits}));
}