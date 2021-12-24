import { createSlice } from '@reduxjs/toolkit';
import {getCollectionMetadata, getListing} from "../core/api";
import {knownContracts, onRankingsLoaded} from "./marketplaceSlice";

const collectionsSlice = createSlice({
    name: 'collections',
    initialState: {
        loading: false,
        error: false,
        collections: [],
        sort: {
            key: 'totalVolume',
            direction: 'desc'
        }
    },
    reducers: {
        collectionsLoading: (state) => {
            state.loading = true;
        },
        collectionsReceived: (state, action) => {
            state.loading = false;
            state.collections = action.payload.collections;
            state.sort = action.payload.sort;
        }
    },
});

export const { collectionsLoading, collectionsReceived } = collectionsSlice.actions;

export default collectionsSlice.reducer;

export const getAllCollections = (sortKey = 'totalVolume', sortDirection = 'desc') => async(dispatch, state) => {
    try {
        dispatch(collectionsLoading());
        const response = await getCollectionMetadata();
        response.collections.forEach(function (collection, index) {
            const contract = knownContracts.find(c => c.address.toUpperCase() === collection.collection.toUpperCase());
            if (contract) {
                response.collections[index].name = contract.name;
                response.collections[index].metadata = contract.metadata;
                response.collections[index].listable = contract.listable;
            }
        });

        const sortedCollections = sortCollections(response.collections, sortKey, sortDirection);

        dispatch(collectionsReceived({
            collections: sortedCollections.filter(c => c.listable),
            sort: {
                key: sortKey,
                direction: sortDirection
            }
        }));
    } catch(error) {
        console.log(error);
    }
}

function sortCollections (collections, key, direction) {
    return collections.sort((a, b) => {
        const newA = isNumeric(a[key]) ? parseInt(a[key]) : a[key];
        const newB = isNumeric(b[key]) ? parseInt(b[key]) : b[key];

        if (direction === 'asc') {
            return newA > newB ? 1 : -1;
        }

        return newA < newB ? 1 : -1;
    })
}

function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}