import React from 'react';
import { useSelector } from "react-redux";

import Footer from '../components/Footer';
import { createGlobalStyle } from 'styled-components';
import {Redirect} from "react-router-dom";
import MyListingsCollection from "../components/MyListingsCollection";

const GlobalStyles = createGlobalStyle`
`;

const MyListings = () => {
    const walletAddress = useSelector((state) => state.user.address)


    const Content = () => (
        <>
            <GlobalStyles/>

            <section className='jumbotron breadcumb no-bg'
                     style={{backgroundImage: `url(${'/img/background/subheader.jpg'})`}}>
                <div className='mainbreadcumb'>
                    <div className='container'>
                        <div className='row m-10-hor'>
                            <div className='col-12 text-center'>
                                <h1>My Listings</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='container'>
                <MyListingsCollection
                    walletAddress={walletAddress}
                />
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

export default MyListings;