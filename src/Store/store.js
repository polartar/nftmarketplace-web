import { applyMiddleware, compose, createStore, combineReducers } from "redux";

import thunk from "redux-thunk";
import {memberships} from "../GlobalState/Memberships";
import { cronies } from "../GlobalState/Cronies";
import marketplaceReducer from "../GlobalState/marketplaceSlice";
import listingReducer from "../GlobalState/listingSlice";
import nftReducer from "../GlobalState/nftSlice";
import collectionsReducer from "../GlobalState/collectionsSlice";
import collectionReducer from "../GlobalState/collectionSlice";
import { initState } from '../GlobalState/CreateSlice'
import { user } from "../GlobalState/User";

const rootReducer = combineReducers({
    // initState: initState,
    memberships: memberships,
    cronies: cronies,
    // user : user,

    marketplace: marketplaceReducer,
    listing: listingReducer,
    nft: nftReducer,
    user: user,
    initState: initState,
    collections: collectionsReducer,
    collection: collectionReducer
});

const middleware = [thunk];


const configureStore = () => {
    const enableDevTools = process.env.NODE_ENV !== 'production' || process.env.REACT_APP_ENABLE_DEVTOOLS === 'true';

    if (enableDevTools) {
        const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
        return createStore(rootReducer, composeEnhancers(applyMiddleware(...middleware)));
    }

    return createStore(rootReducer, applyMiddleware(...middleware));
};

const store = configureStore();

export default store;
