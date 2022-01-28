import React, { memo } from 'react';
import { connect } from "react-redux";

import Footer from '../components/Footer';
import { createGlobalStyle } from 'styled-components';
import {Redirect} from "react-router-dom";
import MyNftDispatcher from "../components/MyNftDispatcher";
import NftCardList from "../components/MyNftCardList";
import MyNftTransferDialog from "../components/MyNftTransferDialog";
import MyNftCancelDialog from "../components/MyNftCancelDialog";
import MyNftListDialog from "../components/MyNftListDialog";


const GlobalStyles = createGlobalStyle`
`;

const mapStateToProps = (state) => ({
    walletAddress: state.user.address
});

const MyNfts = ({ walletAddress }) => {

    if (!walletAddress) {
        return (<Redirect to='/marketplace'/>);
    }

    return (
        <div>
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
                <MyNftDispatcher/>
                <NftCardList/>
                <MyNftTransferDialog/>
                <MyNftCancelDialog/>
                <MyNftListDialog/>
            </section>

            <Footer/>
        </div>
    );
};
export default connect(mapStateToProps)(memo(MyNfts));
