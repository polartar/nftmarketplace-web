import { applyMiddleware, compose, createStore, combineReducers } from "redux";

import thunk from "redux-thunk";
import {memberships} from "../GlobalState/Memberships";
import { cronies } from "../GlobalState/Cronies";
import marketplaceReducer from "../GlobalState/marketplaceSlice";
import listingReducer from "../GlobalState/listingSlice";
import nftReducer from "../GlobalState/nftSlice";
import collectionsReducer from "../GlobalState/collectionsSlice";
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
    collections: collectionsReducer
});

const middleware = [thunk];
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// const enhancer = composeEnhancers(applyMiddleware(...middleware));


const configureStore = () => {
    // return createStore(rootReducer, enhancer);
    return createStore(rootReducer, applyMiddleware(...middleware));
  };

const store = configureStore();

export default store;