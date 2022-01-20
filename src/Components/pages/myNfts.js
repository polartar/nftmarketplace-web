import React, { memo, useCallback, useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from "react-redux";

import Footer from '../components/Footer';
import { createGlobalStyle } from 'styled-components';
import MyNftCollection from "../components/MyNftCollection";
import {Redirect} from "react-router-dom";
import { fetchNfts } from "../../GlobalState/User";
import { getAnalytics, logEvent } from "@firebase/analytics";


const GlobalStyles = createGlobalStyle`
`;

const mapStateToProps = (state) => ({
    walletAddress: state.user.address,
    walletProvider: state.user.provider,
    nftsInitialized: state.user.nftsInitialized,
});

const MyNfts = ({ walletAddress, walletProvider, nftsInitialized }) => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchNfts(walletAddress, walletProvider, nftsInitialized));
    }, []);

    useEffect(() => {
        logEvent(getAnalytics(), 'screen_view', {
            firebase_screen : 'my_nfts'
        })
    }, []);

    const Content = () => (
        <>
            <GlobalStyles/>

            <section className='jumbotron breadcumb no-bg'
                     style={{backgroundImage: `url(${'/img/background/subheader.jpg'})`}}>
                <div className='mainbreadcumb'>
                    <div className='container'>
                        <div className='row m-10-hor'>
                            <div className='col-12 text-center'>
                                <h1>My NFTs</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='container'>
                <MyNftCollection/>
            </section>

            <Footer/>
        </>
    );


    return (
        <div>
            {(walletAddress)?
                <Content/>
                :
                <Redirect to='/marketplace'/>
            }
        </div>
    );
};
export default connect(mapStateToProps)(memo(MyNfts));
