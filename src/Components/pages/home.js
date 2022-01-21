import React, { useEffect, useState } from 'react';
import {useDispatch, useSelector} from "react-redux";
import Footer from '../components/Footer';
import { createGlobalStyle, default as styled } from 'styled-components';
import ListingCollection from "../components/ListingCollection";
import {Link, useHistory} from "react-router-dom";
import HotCollections from "../components/HotCollections";
import { keyframes } from "@emotion/react";
import {siPrefixedNumber} from "../../utils";
import {getMarketData} from "../../GlobalState/marketplaceSlice";
import Reveal from "react-awesome-reveal";
import { theme } from "../../Theme/theme";

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

const Jumbotron = {
    Host: styled.div.attrs(({theme}) => ({
        className: ''
    }))`
      background-image: url('./img/background/Ebisus-bg-1_L.jpg');
      background-size: cover;
      height: max(100vh, 800px);
      display: flex;
      align-items: center;
      
      @media only screen and (max-width: ${({theme}) => theme.breakpoints.md}) {
        max-width: ${({theme}) => theme.breakpoints.md};
        height: 200px
      }
    `,
    Data: styled.div.attrs(({theme}) => ({
        className: ''
    }))`
      max-width: 700px;
      
      padding: 1.5rem !important;
      display: flex;
      flex-direction: column;
      gap: 30px;
      background: #FFFFFFDD;
      border-radius: 10px;

    `
}

const Home = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const [ mobile, setMobile ] = useState(window.innerWidth < theme.breakpointsNum.md);

    const marketData = useSelector((state) => {
        return state.marketplace.marketData;
    })

    useEffect(() => {
        const breakpointObserver = ({ target }) => {
            const { innerWidth } = target;
            const newValue = innerWidth < theme.breakpointsNum.md;
            setMobile(newValue);

        };

        window.addEventListener('resize', breakpointObserver);

        return () => {
            window.removeEventListener('resize', breakpointObserver);
        }
    }, [dispatch])


    const navigateTo = (link) => {
        history.push(link);
    }

    useEffect(async function() {
        dispatch(getMarketData())
    }, []);

    const JumbotronData = () => {
        return (
            <Jumbotron.Data>
                <h6><span className="text-uppercase color">Ebisu's Bay Marketplace</span></h6>
                <Reveal className='onStep' keyframes={ fadeInUp } delay={ 300 } duration={ 900 } triggerOnce>
                    <h1>Discover <span className="color">rare</span> digital art and collect NFTs</h1>
                </Reveal>
                <Reveal className='onStep' keyframes={ fadeInUp } delay={ 600 } duration={ 900 } triggerOnce>
                    <p className="lead">
                        Ebisu's Bay is the first NFT marketplace on Cronos. Create, buy, sell, trade and enjoy the
                        #CroFam NFT community.
                    </p>
                </Reveal>
                <Reveal className='onStep call-to-action' keyframes={ inline } delay={ 800 } duration={ 900 }
                        triggerOnce>
                    <div
                        className="min-width-on-column mb-2 w-100 d-inline-flex flex-column flex-md-row flex-lg-column flex-xl-row gap-3   align-items-center">

                                    <span onClick={ () => window.open('/marketplace', "_self") }
                                          className="m-0 text-nowrap p-4 pt-2 pb-2 btn-main inline lead">Explore</span>

                        <span onClick={ () => window.open('https://forms.gle/rRtn6gp16tyavQge9', "_blank") }
                              className="m-0 text-nowrap p-4 pt-2 pb-2 btn-main btn-outline inline white lead"
                              style={ { outline: '1px solid #DDD' } }>Become a Creator</span>

                        <span onClick={ () => window.open(`/drops/founding-member`, "_self") }
                              className="m-0 text-nowrap p-4 pt-2 pb-2 btn-main btn-outline inline white lead"
                              style={ { outline: '1px solid #DDD' } }>Become a Member</span>

                    </div>
                </Reveal>
                <Reveal className='onStep d-inline' keyframes={ inline } delay={ 900 } duration={ 1200 } triggerOnce>
                    <div className="row">
                        <div className="spacer-single"></div>
                        { marketData &&
                            <div className="row">
                                <div className="col-4 col-sm-4 col-md-4 col-12  mb30 ">
                                    <div className="de_count text-center text-md-start">
                                        <h3><span>{ siPrefixedNumber(Number(marketData.totalVolume).toFixed(0)) }</span>
                                        </h3>
                                        <h5 className="id-color">Volume</h5>
                                    </div>
                                </div>

                                <div className="col-4 col-sm-4 col-md-4 col-12 mb30 ">
                                    <div className="de_count text-center text-md-start">
                                        <h3><span>{ siPrefixedNumber(Number(marketData.totalSales).toFixed(0)) }</span>
                                        </h3>
                                        <h5 className="id-color">NFTs Sold</h5>
                                    </div>
                                </div>

                                <div className="col-4 col-sm-4 col-md-4 col-12 mb30 ">
                                    <div className="de_count text-center text-md-start">
                                        <h3><span>{ siPrefixedNumber(marketData.totalActive) }</span></h3>
                                        <h5 className="id-color">Active Listings</h5>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </Reveal>
            </Jumbotron.Data>
        );
    }

    return (
        <div>
            <GlobalStyles/>
            <Jumbotron.Host>
                { !mobile && <div className="container">{JumbotronData()}</div>}
            </Jumbotron.Host>
            { mobile && JumbotronData()}


            <section className='container no-bottom'>
                <div className='row'>
                    <div className="col-12">
                        <div className="feature-box style-4 text-center">
                            <div className="text">
                                <h2>Ebisu's Bay Annual Charity Ball</h2>
                                <div className="small-border"></div>
                                <p>There is no better feeling than the wholesomeness of giving to those less fortunate. Ebisu’s Bay has received fantastic support from our community in helping us create something that is a pillar within the Cronos community. This is why we are excited to host the first of many, our <span className="fw-bold">Ebisu’s Bay Annual Charity Ball</span>!</p>
                                <p>Ebisu’s Bay is hosting a charity auction January 21 2022; various projects have chosen charities and donated beautiful one-of-a-kind art where the community can bid for these limited-edition pieces. All proceeds will be going to the chosen charities.</p>
                                <div className="d-flex flex-row justify-content-evenly">
                                    <a href="https://blog.ebisusbay.com/ebisus-bay-charity-ball-2fe3efb601be" className="btn-main m-auto">More Information</a>
                                    <Link to="/charity-ball" className="btn-main m-auto">View Auctions</Link>
                                </div>
                            </div>
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
