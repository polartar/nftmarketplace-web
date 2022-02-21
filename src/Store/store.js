import { applyMiddleware, compose, createStore, combineReducers } from 'redux';

import thunk from 'redux-thunk';
import * as Sentry from '@sentry/react';
import createSentryMiddleware from 'redux-sentry-middleware';

import { memberships } from '../GlobalState/Memberships';
import { cronies } from '../GlobalState/Cronies';
import marketplaceReducer from '../GlobalState/marketplaceSlice';
import auctionsReducer from '../GlobalState/auctionsSlice';
import listingReducer from '../GlobalState/listingSlice';
import auctionReducer from '../GlobalState/auctionSlice';
import nftReducer from '../GlobalState/nftSlice';
import collectionsReducer from '../GlobalState/collectionsSlice';
import collectionReducer from '../GlobalState/collectionSlice';
import { appInitializeStateReducer } from '../GlobalState/InitSlice';
import { user } from '../GlobalState/User';
import { toast } from 'react-toastify';

const toastLogger = (store) => (next) => (action) => {
  toast.info(action.type, { closeOnClick: true });
  let result = next(action);
  return result;
};

const rootReducer = combineReducers({
  memberships: memberships,
  cronies: cronies,
  marketplace: marketplaceReducer,
  auctions: auctionsReducer,
  listing: listingReducer,
  auction: auctionReducer,
  nft: nftReducer,
  user: user,
  appInitialize: appInitializeStateReducer,
  collections: collectionsReducer,
  collection: collectionReducer,
});

const reduxDevToolsComposeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const sentryEnhancedMiddlewares = applyMiddleware(thunk, createSentryMiddleware(Sentry, {}), toastLogger);

const enableDevTools = process.env.NODE_ENV !== 'production' || process.env.REACT_APP_DEVTOOLS === 'true';

const reduxDevToolsEnhancedMiddlewares = enableDevTools
  ? reduxDevToolsComposeEnhancers(sentryEnhancedMiddlewares)
  : sentryEnhancedMiddlewares;

const store = createStore(rootReducer, reduxDevToolsEnhancedMiddlewares);

export default store;
