import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { useSelector } from 'react-redux'
import Home from '../components/pages/home';
import Marketplace from '../components/pages/marketplace';
import Collection from '../components/pages/collection';
import Seller from '../components/pages/seller';
import Listing from '../components/pages/listing';
import Nft from '../components/pages/nft';
import MyNfts from '../components/pages/myNfts';
import Header from "../components/menu/header";

export const AppRouter = () => {

    const walletConnected = useSelector((state) => {
        return state.wallet.address !== null;
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
                {/*<Route exact path="/drop" component={Drop} />*/}
                <Route exact path="/listing/:id" component={Listing}/>
                <Route exact path="/collection/:address" component={Collection} />
                <Route exact path="/collection/:address/:id" component={Nft} />
                <Route exact path="/seller/:address" component={Seller} />
            </Switch>
        </Router>
    );
};
