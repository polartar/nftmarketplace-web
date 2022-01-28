import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import * as Sentry from '@sentry/react';
import { useSelector } from 'react-redux'
import Home from '../Components/pages/home';
import Marketplace from '../Components/pages/marketplace';
import Collection from '../Components/pages/collection';
import Seller from '../Components/pages/seller';
import Listing from '../Components/pages/listing';
import Auction from '../Components/pages/auction';
import Nft from '../Components/pages/nft';
import MyNfts from '../Components/pages/myNfts';
import Header from "../Components/menu/header";
import Drops from "../Components/pages/drops";
import Drop from "../Components/pages/drop";
import MySales from "../Components/pages/mySales";
import Collections from "../Components/pages/collections";
import ManageAuctions from "../Components/pages/manageAuctions";
import CharityBall from "../Components/pages/charityBall";
import history from "../history";
import { ErrorPage } from "../Components/pages/ErrorPage";
const SentryEnhancedRoute = Sentry.withSentryRouting(Route);

export const AppRouter = () => {

    const walletConnected = useSelector((state) => {
        return state.user.address !== null;
    });

    function PrivateRoute({ component: Component, ...rest }) {
        if (process.env.NODE_ENV !== 'production') {
            console.log('wallet='+walletConnected);
        }

        return (
            <SentryEnhancedRoute {...rest} render={props => {
                if (!walletConnected) {
                    // not logged in so redirect to login page with the return url
                    return <Redirect to={{ pathname: '/', state: { from: props.location } }} />
                }

                // authorized so return component
                return <Component {...props} />
            }} />
        );
    }

    return (
        <Router history={history}>
            <Sentry.ErrorBoundary  fallback={() => <ErrorPage/>}>
            <Header/>
                <Switch>
                    <SentryEnhancedRoute exact path="/" component={Home} />
                    <SentryEnhancedRoute path='/home' render={() => (
                        <Redirect to="/" />
                    )}/>
                    <SentryEnhancedRoute exact path="/marketplace" component={Marketplace} />
                    {/*<Route exact path="/roadmap" component={Roadmap} />*/}
                    <PrivateRoute  exact path="/nfts" component={MyNfts} />
                    <PrivateRoute  exact path="/sales" component={MySales} />
                    <SentryEnhancedRoute exact path="/drops" component={Drops} />
                    <SentryEnhancedRoute exact path="/drops/:slug" component={Drop} />
                    <SentryEnhancedRoute exact path="/listing/:id" component={Listing}/>
                    <SentryEnhancedRoute exact path="/manage/auctions" component={ManageAuctions}/>
                    <SentryEnhancedRoute exact path="/auctions/:id" component={Auction}/>
                    <SentryEnhancedRoute exact path="/collections" component={Collections}/>
                    <SentryEnhancedRoute exact path="/collection/:address" component={Collection} />
                    <SentryEnhancedRoute exact path="/collection/:address/:id" component={Nft} />
                    <SentryEnhancedRoute exact path="/seller/:address" component={Seller} />
                    <SentryEnhancedRoute exact path="/charity-ball" component={CharityBall} />
                    <SentryEnhancedRoute path='*' render={() => (
                        <Redirect to="/" />
                    )}/>
                </Switch>
            </Sentry.ErrorBoundary>
        </Router>
    );
};
