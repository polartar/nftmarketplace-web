import { createSlice } from '@reduxjs/toolkit';
import {sortAndFetchListings, getCollectionMetadata, getCollectionTraits} from '../core/api';
import config from '../Assets/networks/rpc_config.json'
export const knownContracts = config.known_contracts;

const collectionSlice = createSlice({
    name: 'collection',
    initialState: {
        loading: false,
        error: false,
        listings: [],
        query: {
            page: 0,
            filter: {},
            sort: {},
            search: null,
            traits: {}
        },
        totalPages: 0,
        stats: null,
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
            state.query.page = action.payload.page;
            state.totalPages = action.payload.totalPages;
            state.hasRank = action.payload.hasRank;
        },
        clearSet: (state) => {
            state.listings = [];
            state.totalPages = 0;
            state.query.page = 0;
            state.query.filter = {};
            state.query.sort = {};
            state.query.search = null;
        },
        onFilter: (state, action) => {
            state.listings = [];
            state.totalPages = 0;
            state.query.page = 0;
            state.query.filter = action.payload;
        },
        onSort: (state, action) => {
            state.listings = [];
            state.totalPages = 0;
            state.query.page = 0;
            state.query.sort = action.payload;
        },
        onSearch: (state, action) => {
            state.listings = [];
            state.totalPages = 0;
            state.query.page = 0;
            state.query.search = action.payload;
        },
        onTraitFilter: (state, action) => {
            state.listings = [];
            state.totalPages = 0;
            state.query.page = 0;
            state.query.traits = action.payload;
        },
        onCollectionStatsLoaded: (state, action) => {
            state.stats = action.payload.stats;
        }
    },
});

export const {
    listingsLoading,
    listingsReceived,
    onFilter,
    onSort,
    onSearch,
    onTraitFilter,
    clearSet,
    onCollectionStatsLoaded,
} = collectionSlice.actions;

export default collectionSlice.reducer;

export const init = (sort, filter) => async (dispatch) => {
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
        state.collection.query.page + 1,
        state.collection.query.sort,
        state.collection.query.filter.type,
        state.collection.query.filter.address,
        state.collection.query.traits,
        state.collection.query.search
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

export const searchListings = (value) => async (dispatch) => {
    dispatch(onSearch(value));
    dispatch(fetchListings());
}

export const filterListingsByTrait = (traits) => async (dispatch) => {
    dispatch(onTraitFilter(traits));
    dispatch(fetchListings());
}

export const resetListings = () => async (dispatch) => {
    dispatch(clearSet());
    dispatch(fetchListings());
}

export const getStats = (address) => async(dispatch) => {
    try {
        const response = await getCollectionMetadata(address);
        const traits  = await getCollectionTraits(address);
        dispatch(onCollectionStatsLoaded({
            stats: {...response.collections[0], ...{traits: traits}},
        }));
    } catch(error) {
        console.log(error);
    }
}