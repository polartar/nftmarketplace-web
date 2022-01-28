import React, { memo, useEffect } from 'react';
import { connect, useDispatch } from "react-redux";

import { fetchNfts } from "../../GlobalState/User";
import { getAnalytics, logEvent } from "@firebase/analytics";

const mapStateToProps = (state) => ({
    walletAddress: state.user.address,
    walletProvider: state.user.provider,
    nftsInitialized: state.user.nftsInitialized,
});

const MyNftDispatcher = ({ walletAddress, walletProvider, nftsInitialized }) => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchNfts(walletAddress, walletProvider, nftsInitialized));
    }, []);

    useEffect(() => {
        logEvent(getAnalytics(), 'screen_view', {
            firebase_screen : 'my_nfts'
        })
    }, []);

    return (
        <></>
    );
};
export default connect(mapStateToProps)(memo(MyNftDispatcher));
