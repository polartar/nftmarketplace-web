import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from "react-redux";

import ListingCollection from '../components/ListingCollection';
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';
import TopFilterBar from '../components/TopFilterBar';
import {ethers} from "ethers";
import {getMarketData} from "../../GlobalState/marketplaceSlice";

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.sticky.white {
    background-color: #ff7814;
    border-bottom: solid 1px #ff7814;
    background-image: linear-gradient(to right, #ff690e, #ffb84e)
    -webkit-transform: translate3d(0,0,0);
  }
  header#myHeader.navbar .search #quick_search{
    color: #fff;
    background: rgba(255, 255, 255, .1);
  }
  header#myHeader.navbar.white .btn, .navbar.white a, .navbar.sticky.white a{
    color: #fff;
  }
  header#myHeader .dropdown-toggle::after{
    color: rgba(255, 255, 255, .5);;
  }
  header#myHeader .logo .d-block{
    display: none !important;
  }
  header#myHeader .logo .d-none{
    display: block !important;
  }
  @media only screen and (max-width: 1199px) {
    .navbar{
      background: #ff7814;
    }
    .navbar .menu-line, .navbar .menu-line1, .navbar .menu-line2{
      background: #fff;
    }
    .item-dropdown .dropdown a{
      color: #fff !important;
    }
  }
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
                        <div className="d-item col-lg-6 col-sm-8 mb-4 mx-auto">
                            <a className="nft_attr">
                                <div className="row">
                                    <div className="col-4">
                                        <h5>Volume</h5>
                                        <h4>{ethers.utils.commify(Number(marketData.totalVolume).toFixed(0))} CRO</h4>
                                    </div>
                                    <div className="col-4">
                                        <h5>Sales</h5>
                                        <h4>{ethers.utils.commify(Number(marketData.totalSales).toFixed(0))}</h4>
                                    </div>
                                    <div className="col-4">
                                        <h5>Active</h5>
                                        <h4>{ethers.utils.commify(marketData.totalActive)}</h4>
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