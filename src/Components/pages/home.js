import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';
import ListingCollection from "../components/ListingCollection";
import {useHistory} from "react-router-dom";
import HotCollections from "../components/HotCollections";
import HomeCarousel from "../components/HomeCarousel";
import { keyframes } from "@emotion/react";
import {siPrefixedNumber} from "../../utils";
import {getMarketData} from "../../GlobalState/marketplaceSlice";

const fadeInUp = keyframes`
  0% {
    opacity: 0;
    -webkit-transform: translateY(40px);
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
`;

const GlobalStyles = createGlobalStyle`
  .jumbotron h1, .jumbotron h3, .jumbotron h5, .jumbotron p {
    color: #fff;
  }
  .de_count h3 {
    font-size: 36px;
    margin-bottom: 0px;
  }
`;

const Home = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const marketData = useSelector((state) => {
        return state.marketplace.marketData;
    })

    const navigateTo = (link) => {
        history.push(link);
    }

    useEffect(async function() {
        dispatch(getMarketData())
    }, []);

    return (
        <div>
            <GlobalStyles/>
            <section className="jumbotron breadcumb no-bg h-vh"
                     style={{backgroundImage: `url(${'./img/background/7.jpg'})`}}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <div className="spacer-single"></div>
                            <h6><span className="text-uppercase color">Ebisu's Bay Marketplace</span></h6>
                            <div className="onStep css-2yud45"><h1 className="col-white">Discover <span
                                className="color">rare</span> digital art and collect NFTs</h1>
                            </div>
                            <div className="onStep css-gb9rv5"><p className="lead col-white">Unit of
                                data stored on a digital ledger, called a blockchain, that certifies a
                                digital asset to be unique and therefore not interchangeable</p></div>
                            <div className="spacer-10"></div>
                            <div className="onStep d-inline css-1i8mt5g">
                                <span className="btn-main inline lead" onClick={()=> window.open('/marketplace', "_self")}>Explore</span>
                            </div>
                            <div className="onStep d-inline css-1i8mt5g"><span
                                className="btn-main inline white lead" onClick={()=> window.open('https://forms.gle/rRtn6gp16tyavQge9', "_blank")}>Become a Creator</span>
                            </div>
                            <div className="onStep d-inline css-1i8mt5g">
                                <div className="mb-sm-30"></div>
                            </div>
                            <div className="onStep d-inline css-51map3">
                                <div className="row">
                                    <div className="spacer-single"></div>
                                    {marketData && (
                                        <div className="row">
                                            <div className="col-lg-4 col-md-6 col-sm-4 mb30">
                                                <div className="de_count text-left">
                                                    <h3><span>{siPrefixedNumber(Number(marketData.totalVolume).toFixed(0))}</span></h3>
                                                    <h5 className="id-color">Volume</h5>
                                                </div>
                                            </div>
                                            <div className="col-lg-4 col-md-6 col-sm-4 mb30">
                                                <div className="de_count text-left">
                                                    <h3><span>{siPrefixedNumber(Number(marketData.totalSales).toFixed(0))}</span></h3>
                                                    <h5 className="id-color">NFTs Sold</h5>
                                                </div>
                                            </div>
                                            <div className="col-lg-4 col-md-6 col-sm-4 mb30">
                                                <div className="de_count text-left">
                                                    <h3><span>{siPrefixedNumber(marketData.totalActive)}</span></h3>
                                                    <h5 className="id-color">Active Listings</h5>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className='col-lg-6 px-0'>
                            <HomeCarousel/>
                        </div>
                    </div>
                </div>
            </section>

            <section className='container no-top'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-lg-12'>
                            <div className="spacer-double"></div>
                            <h2 className='style-2'>New Listings</h2>
                        </div>
                    </div>
                    <ListingCollection showLoadMore={false}/>
                    <div className='col-lg-12'>
                        <div className="spacer-single"></div>
                        <span onClick={() => navigateTo(`/marketplace`)} className="btn-main lead m-auto">View Marketplace</span>
                    </div>
                </div>
            </section>

            <section className='container'>
                <div className='row'>
                    <div className='col-lg-12'>
                        <h2 className='style-2'>Hot Collections</h2>
                    </div>
                </div>
                <div className='container'>
                    <div className='row'>
                        <div className='col-lg-12'>
                            <HotCollections/>
                        </div>
                    </div>
                </div>
            </section>

            <Footer/>

        </div>
    );
};
export default Home;