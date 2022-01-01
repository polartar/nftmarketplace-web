import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';
import ListingCollection from "../components/ListingCollection";
import {useHistory} from "react-router-dom";
import HotCollections from "../components/HotCollections";
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
  .header-card {
    background: #FFFFFFDD;
    border-radius: 10px;
  }
    
  .de_count h3 {
    font-size: 36px;
    margin-bottom: 0px;
  }
  
  @media only screen and (max-width: 1199.98px) {
    .min-width-on-column > span {
      min-width: 200px;
    }  
  }
  
  @media only screen and (max-width: 464px) {
    .header-card .call-to-action {
        text-align: center !important
    }
    
    //  jumbotron
    .h-vh {
      height: unset !important;
      min-height: 100vh;
      padding-top: 1rem;
      padding-bottom: 1rem;
    }
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
                     style={{backgroundImage: `url(${'./img/background/Ebisus-bg-1_L.jpg'})`}}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 header-card px-4">
                            <div className="spacer-single"></div>
                            <h6>
                                <span className="text-uppercase color">Ebisu's Bay Marketplace</span>
                            </h6>
                            <Reveal className='onStep' keyframes={fadeInUp} delay={300} duration={900} triggerOnce>
                                <h1>Discover <span className="color">rare</span> digital art and collect NFTs</h1>
                            </Reveal>
                            <Reveal className='onStep' keyframes={fadeInUp} delay={600} duration={900} triggerOnce>
                                <p className="lead">
                                    Ebisu's Bay is the first NFT marketplace on Cronos. Create, buy, sell, trade and enjoy the #CroFam NFT community.
                                </p>
                            </Reveal>
                            <div className="spacer-10"></div>
                            <Reveal className='onStep call-to-action' keyframes={inline} delay={800} duration={900} triggerOnce>
                                <div className="min-width-on-column mb-2 w-100 d-inline-flex flex-column flex-md-row flex-lg-column flex-xl-row gap-3   align-items-center">

                                    <span onClick={()=> window.open('/marketplace', "_self")}
                                          className="m-0 text-nowrap p-4 pt-2 pb-2 btn-main inline lead">Explore</span>

                                    <span onClick={()=> window.open('https://forms.gle/rRtn6gp16tyavQge9', "_blank")}
                                          className="m-0 text-nowrap p-4 pt-2 pb-2 btn-main btn-outline inline white lead"
                                          style={{outline: '1px solid #DDD'}}>Become a Creator</span>

                                    <span onClick={()=> window.open(`/drops/founding-member`, "_self")}
                                          className="m-0 text-nowrap p-4 pt-2 pb-2 btn-main btn-outline inline white lead"
                                          style={{outline: '1px solid #DDD'}}>Become a Member</span>

                                </div>
                                <div className="mb-sm-30"></div>
                            </Reveal>

                            <Reveal className='onStep d-inline' keyframes={inline} delay={900} duration={1200} triggerOnce>
                                <div className="row">
                                    <div className="spacer-single"></div>
                                    {marketData &&
                                        <div className="row">
                                            <div className="col-4 col-sm-4 col-md-4 col-12  mb30 ">
                                                <div className="de_count text-center text-md-start">
                                                    <h3><span>{siPrefixedNumber(Number(marketData.totalVolume).toFixed(0))}</span></h3>
                                                    <h5 className="id-color">Volume</h5>
                                                </div>
                                            </div>

                                            <div className="col-4 col-sm-4 col-md-4 col-12 mb30 ">
                                                <div className="de_count text-center text-md-start">
                                                    <h3><span>{siPrefixedNumber(Number(marketData.totalSales).toFixed(0))}</span></h3>
                                                    <h5 className="id-color">NFTs Sold</h5>
                                                </div>
                                            </div>

                                            <div className="col-4 col-sm-4 col-md-4 col-12 mb30 ">
                                                <div className="de_count text-center text-md-start">
                                                    <h3><span>{siPrefixedNumber(marketData.totalActive)}</span></h3>
                                                    <h5 className="id-color">Active Listings</h5>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </section>

            <section className='container no-bottom'>
                <div className='row'>
                    <div className='col-lg-12'>
                        <div className='text-center'>
                            <h2>Hot Collections</h2>
                            <div className="small-border"></div>
                        </div>
                    </div>
                    <div className='col-lg-12'>
                        <HotCollections/>
                    </div>
                </div>
            </section>

            <section className='container'>
                <div className='row'>
                    <div className='col-lg-12'>
                        <div className='text-center'>
                            <h2>New Listings</h2>
                            <div className="small-border"></div>
                        </div>
                    </div>
                    <div className='col-lg-12'>
                        <ListingCollection showLoadMore={false}/>
                    </div>
                    <div className='col-lg-12'>
                        <div className="spacer-single"></div>
                        <span onClick={() => navigateTo(`/marketplace`)} className="btn-main lead m-auto">View Marketplace</span>
                    </div>
                </div>
            </section>

            <Footer/>

        </div>
    );
};
export default Home;
