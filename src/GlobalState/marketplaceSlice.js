import { createSlice } from '@reduxjs/toolkit';
import {sortAndFetchListings, getCollectionMetadata, getMarketMetadata, getCollectionTraits} from '../core/api';
import config from '../Assets/networks/rpc_config.json'
export const knownContracts = config.known_contracts;

const marketplaceSlice = createSlice({
    name: 'marketplace',
    initialState: {
        loading: false,
        error: false,
        listings: [],
        curPage: 0,
        curFilter: {},
        curSort: {},
        totalPages: 0,
        collection: null,
        marketData: null,
        hasRank: false
    },
    reducers: {
        listingsLoading: (state, action) => {
            state.loading = true;
            state.error = false;
        },
        listingsReceived: (state, action) => {
            state.loading = false;
            state.error = false;
            state.listings.push(...action.payload.listings);
            state.curPage = action.payload.page;
            state.totalPages = action.payload.totalPages;
            state.hasRank = action.payload.hasRank;
        },
        clearSet: (state) => {
            state.listings = [];
            state.curPage = 0;
            state.totalPages = 0;
            state.curFilter = {};
            state.curSort = {};
        },
        onFilter: (state, action) => {
            state.listings = [];
            state.totalPages = 0;
            state.curPage = 0;
            state.curFilter = action.payload;
        },
        onSort: (state, action) => {
            state.listings = [];
            state.totalPages = 0;
            state.curPage = 0;
            state.curSort = action.payload;
        },
        onCollectionDataLoaded: (state, action) => {
            state.collection = action.payload.collection;
        },
        onMarketDataLoaded(state, action) {
            state.marketData = action.payload.marketdata;
        }
    },
    // extraReducers: (builder) => {
    //     builder.addCase(getListings.fulfilled, (state, action) => {
    //         state.listings = action.payload;
    //     })
    // }
});

export const {
    listingsLoading,
    listingsReceived,
    onFilter,
    onSort,
    clearSet,
    onCollectionDataLoaded,
    onRankingsLoaded,
    onMarketDataLoaded
} = marketplaceSlice.actions;

export default marketplaceSlice.reducer;

export const init = (sort, filter) => async (dispatch, getState) => {
    dispatch(clearSet());

    if (sort) {
        dispatch(onSort({
            type: sort.type,
            direction: sort.direction
        }));
    }

    if (filter) {
        dispatch(onFilter({
            type: filter.type,
            address: filter.address
        }));
    }
}

export const fetchListings = () => async (dispatch, getState) => {
    const state = getState();

    dispatch(listingsLoading());
    const response = await sortAndFetchListings(
        state.marketplace.curPage + 1,
        state.marketplace.curSort,
        state.marketplace.curFilter.type,
        state.marketplace.curFilter.address
    );

    response.hasRank = response.listings.length > 0 && typeof response.listings[0].nft.rank !== 'undefined';

    dispatch(listingsReceived(response));
}

export const filterListings = (type, address) => async (dispatch) => {
    dispatch(onFilter({
        type: type,
        address: address
    }));
    dispatch(fetchListings());
}

export const sortListings = (type, direction) => async (dispatch) => {
    dispatch(onSort({
        type: type,
        direction: direction
    }));
    dispatch(fetchListings());
}

export const resetListings = () => async (dispatch) => {
    dispatch(clearSet());
    dispatch(fetchListings());
}

export const getCollectionData = (address) => async(dispatch) => {
    try {
        const response = await getCollectionMetadata(address);
        dispatch(onCollectionDataLoaded({
            collection: response.collections[0],
        }));
    } catch(error) {
        console.log(error);
    }
}

export const getMarketData = () => async(dispatch) => {
    try {
        const response = await getMarketMetadata();
        dispatch(onMarketDataLoaded({
            marketdata: response
        }))
    } catch(error) {
        console.log(error);
    }
}