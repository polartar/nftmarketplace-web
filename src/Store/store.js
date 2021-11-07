import { applyMiddleware, compose, createStore, combineReducers } from "redux";

import thunk from "redux-thunk";
import { initState } from '../GlobalState/CreateSlice'
import {memberships} from "../GlobalState/Memberships";
import { cronies } from "../GlobalState/Cronies";

const rootReducer = combineReducers({
    initState: initState,
    memberships: memberships,
    cronies: cronies
});

const middleware = [thunk];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers(applyMiddleware(...middleware));


const configureStore = () => {
    return createStore(rootReducer, enhancer);
  };
  
const store = configureStore();

export default store;