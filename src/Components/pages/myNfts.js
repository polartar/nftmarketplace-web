import React from 'react';
import { useSelector } from "react-redux";

import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';
import TopFilterBar from '../components/TopFilterBar';
import MyNftCollection from "../components/MyNftCollection";
import {Redirect} from "react-router-dom";

const GlobalStyles = createGlobalStyle`
`;

const MyNfts = () => {
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
                                <h1>My NFTs</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='container'>
                <div className='row'>
                    <div className='col-lg-12'>
                        <TopFilterBar showFilter={false}/>
                    </div>
                </div>
                <MyNftCollection
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
export default MyNfts;