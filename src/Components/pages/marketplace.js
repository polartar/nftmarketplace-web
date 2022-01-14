import React, {useEffect} from 'react';
import { useSelector, useDispatch } from "react-redux";

import ListingCollection from '../components/ListingCollection';
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';
import TopFilterBar from '../components/TopFilterBar';
import {getMarketData} from "../../GlobalState/marketplaceSlice";
import {siPrefixedNumber} from "../../utils";
import AuctionCollection from "../components/AuctionCollection";

const GlobalStyles = createGlobalStyle`
`;



const Marketplace = () => {
    const dispatch = useDispatch();

    const marketData = useSelector((state) => {
        return state.marketplace.marketData;
    })

    const [openMenu, setOpenMenu] = React.useState(0);
    const handleBtnClick = (index) => (element) => {
        var elements = document.querySelectorAll('.tab');
        for (var i = 0; i < elements.length; i++) {
            elements[i].classList.remove('active');
        }
        element.target.parentElement.classList.add("active");

        setOpenMenu(index);
    };

    useEffect(async function() {
        dispatch(getMarketData())
    }, []);

    return (
        <div>
            <GlobalStyles/>

            <section className='jumbotron breadcumb no-bg'
                     style={{backgroundImage: `url(${'./img/background/subheader.jpg'})`}}>
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
                </div>
                <div className='row'>
                    <div className='col-lg-12'>
                        <div className="items_filter">
                            <ul className="de_nav">
                                <li id='Mainbtn' className="tab active">
                                    <span onClick={handleBtnClick(0)}>On Sale</span>
                                </li>
                                <li id='Mainbtn1' className="tab">
                                    <span onClick={handleBtnClick(1)}>Auctions</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-lg-12'>
                        <TopFilterBar cacheName='marketplace'/>
                    </div>
                </div>
                {openMenu === 0 &&
                    <ListingCollection cacheName='marketplace'/>
                }
                {openMenu === 1 &&
                    <AuctionCollection cacheName='auctions'/>
                }
            </section>


            <Footer/>
        </div>
    );
};
export default Marketplace;
