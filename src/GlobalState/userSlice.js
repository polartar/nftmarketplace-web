import { createSlice } from '@reduxjs/toolkit';
import {sortAndFetchListings, getCollectionMetadata, getNftsForAddress} from '../core/api';
import config from '../Assets/networks/rpc_config.json'
import { getNftsForUser } from "../core/api";

export const knownContracts = config.known_contracts;

const userSlice = createSlice({
    name: 'user',
    initialState: {
        loading: false,
        error: false,
        nfts: [],
        curPage: 0,
        curFilter: {},
        curSort: {},
        totalPages: 0,
        isMember: false
    },
    reducers: {
        nftsLoading: (state, action) => {
            state.loading = true;
            state.error = false;
        },
        nftsReceived: (state, action) => {
            state.loading = false;
            state.error = false;
            state.nfts = action.payload;
        },
        membershipStatusUpdated: (state, action) => {
            state.isMember = action.payload;
        }
    }
});

export const { nftsLoading, nftsReceived, membershipStatusUpdated } = userSlice.actions;

export default userSlice.reducer;

export const fetchNfts = (walletAddress, walletProvider) => async(dispatch) =>{
    dispatch(nftsLoading());
    console.log('-------');
    console.log(walletAddress, walletProvider);
    const response = await getNftsForAddress(walletAddress, walletProvider);
    console.log(response);
    dispatch(membershipStatusUpdated(response.isMember));
    dispatch(nftsReceived(response.nfts));
}