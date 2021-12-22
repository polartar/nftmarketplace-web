import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { useSelector } from 'react-redux'
import Home from '../Components/pages/home';
import Marketplace from '../Components/pages/marketplace';
import Collection from '../Components/pages/collection';
import Seller from '../Components/pages/seller';
import Listing from '../Components/pages/listing';
import Nft from '../Components/pages/nft';
import MyNfts from '../Components/pages/myNfts';
import Header from "../Components/menu/header";
import Drops from "../Components/pages/drops";
import Drop from "../Components/pages/drop";
import MySales from "../Components/pages/mySales";
import Collections from "../Components/pages/collections";

export const AppRouter = () => {

    const walletConnected = useSelector((state) => {
        return state.user.address !== null;
    });

    function PrivateRoute({ component: Component, ...rest }) {
        console.log('wallet='+walletConnected);
        return (
            <Route {...rest} render={props => {
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
        <Router>
            <Header/>
            <Switch>
                <Route exact path="/" component={Home} />
                <Route path='/home' render={() => (
                    <Redirect to="/" />
                )}/>
                <Route exact path="/marketplace" component={Marketplace} />
                {/*<Route exact path="/roadmap" component={Roadmap} />*/}
                <PrivateRoute  exact path="/nfts" component={MyNfts} />
                <PrivateRoute  exact path="/sales" component={MySales} />
                <Route exact path="/drops" component={Drops} />
                <Route exact path="/drops/:slug" component={Drop} />
                <Route exact path="/listing/:id" component={Listing}/>
                <Route exact path="/collections" component={Collections}/>
                <Route exact path="/collection/:address" component={Collection} />
                <Route exact path="/collection/:address/:id" component={Nft} />
                <Route exact path="/seller/:address" component={Seller} />
                <Route path='*' render={() => (
                    <Redirect to="/" />
                )}/>
            </Switch>
        </Router>
    );
};
