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
import Reveal from "react-awesome-reveal";

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
const inline = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
  .d-inline{
    display: inline-block;
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
                            <h6> <span className="text-uppercase color">Ebisu's Bay Marketplace</span></h6>
                            <Reveal className='onStep' keyframes={fadeInUp} delay={300} duration={900} triggerOnce>
                                <h1 className="col-white">Discover <span className="color">rare</span> digital art and collect NFTs</h1>
                            </Reveal>
                            <Reveal className='onStep' keyframes={fadeInUp} delay={600} duration={900} triggerOnce>
                                <p className="lead col-white">
                                    Ebisu's Bay is the first NFT marketplace on Cronos. Create, buy, sell, trade and enjoy the #crofam NFT community
                                </p>
                            </Reveal>
                            <div className="spacer-10"></div>
                            <Reveal className='onStep d-inline' keyframes={inline} delay={800} duration={900} triggerOnce>
                                <span onClick={()=> window.open('/marketplace', "_self")} className="btn-main inline lead">Explore</span>
                                <span onClick={()=> window.open('https://forms.gle/rRtn6gp16tyavQge9', "_blank")} className="btn-main inline white lead">Become a Creator</span>
                                <div className="mb-sm-30"></div>
                            </Reveal>

                            <Reveal className='onStep d-inline' keyframes={inline} delay={900} duration={1200} triggerOnce>
                                <div className="row">
                                    <div className="spacer-single"></div>
                                    {marketData &&
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
                                    }
                                </div>
                            </Reveal>
                        </div>
                        <div className='col-md-6 px-0 xs-hide'>
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