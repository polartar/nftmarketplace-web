import React from 'react';
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';
import ListingCollection from "../components/ListingCollection";
import {useHistory} from "react-router-dom";
import HotCollections from "../components/HotCollections";
import Reveal from "react-awesome-reveal";
import SliderCarouselSingleRedux from "../components/SliderCarouselSingleRedux";
import { keyframes } from "@emotion/react";

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
  header#myHeader.navbar.sticky.white {
    background: #212428;
    border-bottom: 0;
    box-shadow: 0 4px 20px 0 rgba(10,10,10, .8);
  }
  header#myHeader.navbar.white .btn, .navbar.white a, .navbar.sticky.white a{
    color: #fff;
  }
  header#myHeader .dropdown-toggle::after{
    color: #fff;
  }
  header#myHeader .logo .d-block{
    display: none !important;
  }
  header#myHeader .logo .d-none{
    display: none !important;
  }
  header#myHeader .logo .d-4{
    display: block !important;
  }
  .navbar .menu-line, .navbar .menu-line1, .navbar .menu-line2{
    background: #fff;
  }
  @media only screen and (max-width: 1199px) { 
    .navbar{
      background: #ff7814;
    }
  }
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

    const navigateTo = (link) => {
        history.push(link);
    }

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
                            <div className="onStep d-inline css-1i8mt5g"><span
                                className="btn-main inline lead">Explore</span></div>
                            <div className="onStep d-inline css-1i8mt5g"><span
                                className="btn-main inline white lead">Create</span></div>
                            <div className="onStep d-inline css-1i8mt5g">
                                <div className="mb-sm-30"></div>
                            </div>
                            <div className="onStep d-inline css-51map3">
                                <div className="row">
                                    <div className="spacer-single"></div>
                                    <div className="row">
                                        <div className="col-lg-4 col-md-6 col-sm-4 mb30">
                                            <div className="de_count text-left"><h3><span>94215</span>
                                            </h3><h5 className="id-color">Collectibles</h5></div>
                                        </div>
                                        <div className="col-lg-4 col-md-6 col-sm-4 mb30">
                                            <div className="de_count text-left"><h3><span>27</span>k
                                            </h3><h5 className="id-color">Auctions</h5></div>
                                        </div>
                                        <div className="col-lg-4 col-md-6 col-sm-4 mb30">
                                            <div className="de_count text-left"><h3><span>4</span>k</h3>
                                                <h5 className="id-color">NFT Artist</h5></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
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