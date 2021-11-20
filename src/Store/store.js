import { applyMiddleware, compose, createStore, combineReducers } from "redux";

import thunk from "redux-thunk";
import { initState } from '../GlobalState/CreateSlice'
import {memberships} from "../GlobalState/Memberships";
import { cronies } from "../GlobalState/Cronies";
import { user } from "../GlobalState/User";
import { market } from "../GlobalState/Market";

const rootReducer = combineReducers({
    initState: initState,
    memberships: memberships,
    cronies: cronies,
    user : user,
    market : market
});

const middleware = [thunk];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers(applyMiddleware(...middleware));


const configureStore = () => {
    return createStore(rootReducer, enhancer);
    // return createStore(rootReducer, applyMiddleware(...middleware));
  };
  
const store = configureStore();

export default store;