import React, {useEffect} from 'react';
import { useSelector, useDispatch } from "react-redux";

import ListingCollection from '../components/ListingCollection';
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';
import TopFilterBar from '../components/TopFilterBar';
import {getMarketData} from "../../GlobalState/marketplaceSlice";
import {siPrefixedNumber} from "../../utils";

const GlobalStyles = createGlobalStyle`
`;



const Marketplace = () => {
    const dispatch = useDispatch();

    const marketData = useSelector((state) => {
        return state.marketplace.marketData;
    })

    useEffect(async function() {
        dispatch(getMarketData())
    }, []);

    return (
        <div>
            <GlobalStyles/>

            <section className='jumbotron breadcumb no-bg'
                     style={{backgroundImage: `url(${'./img/background/subheader.png'})`}}>
                <div className='mainbreadcumb'>
                    <div className='container'>
                        <div className='row m-10-hor'>
                            <div className='col-12'>
                                <h1 className='text-center'>Marketplace</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='container'>
                <div className='row'>
                    {marketData && (
                        <div className="d-item col-lg-6 col-sm-10 mb-4 mx-auto">
                            <a className="nft_attr">
                                <div className="row">
                                    <div className="col-4">
                                        <h5>Volume</h5>
                                        <h4>{siPrefixedNumber(Number(marketData.totalVolume).toFixed(0))} CRO</h4>
                                    </div>
                                    <div className="col-4">
                                        <h5>Sales</h5>
                                        <h4>{siPrefixedNumber(Number(marketData.totalSales).toFixed(0))}</h4>
                                    </div>
                                    <div className="col-4">
                                        <h5>Active</h5>
                                        <h4>{siPrefixedNumber(marketData.totalActive)}</h4>
                                    </div>
                                </div>
                            </a>
                        </div>
                    )}
                    <div className='col-lg-12'>
                        <TopFilterBar/>
                    </div>
                </div>
                <ListingCollection/>
            </section>


            <Footer/>
        </div>
    );
};
export default Marketplace;