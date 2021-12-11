import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";

import ListingCollection from '../components/ListingCollection';
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';
import TopFilterBar from '../components/TopFilterBar';
import { knownContracts, getCollectionData } from '../../GlobalState/marketplaceSlice'
import { ethers } from "ethers";
import {humanize} from "../../Store/utils";

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
      background: #403f83;
    }
    .navbar .menu-line, .navbar .menu-line1, .navbar .menu-line2{
      background: #fff;
    }
    .item-dropdown .dropdown a{
      color: #fff !important;
    }
  }
`;

const Collection = () => {
    const { address } = useParams();
    const dispatch = useDispatch();

    const[royalty, setRoyalty] = useState(null);

    const collection = useSelector((state) => {
        return state.marketplace.collection;
    });

    const collectionName = (collectionId) => {
        const contract = knownContracts.find(c => c.address === address);

        return contract ? contract.name : 'Collection';
    }

    useEffect(() => {
        dispatch(getCollectionData('collection', address));
    }, [dispatch, address]);

    return (
        <div>
            <GlobalStyles/>

            <section className='jumbotron breadcumb no-bg'
                     style={{backgroundImage: `url(${'/img/background/subheader.png'})`}}>
                <div className='mainbreadcumb'>
                    <div className='container'>
                        <div className='row m-10-hor'>
                            <div className='col-12 text-center'>
                                <h1>{collectionName(address)}</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='container'>
                <div className='row'>
                    {collection && (
                    <div className="d-item col-lg-8 col-sm-10 mb-4 mx-auto">
                        <a className="nft_attr">
                            <div className="row">
                                <div className="col-md-2 col-sm-4">
                                    <h5>Floor</h5>
                                    <h4>{ethers.utils.commify(Number(collection.floorPrice).toFixed(0))} CRO</h4>
                                </div>
                                <div className="col-md-2 col-sm-4">
                                    <h5>Volume</h5>
                                    <h4>{ethers.utils.commify(Number(collection.totalVolume).toFixed(0))} CRO</h4>
                                </div>
                                <div className="col-md-2 col-sm-4">
                                    <h5>Sales</h5>
                                    <h4>{ethers.utils.commify(collection.numberOfSales)}</h4>
                                </div>
                                <div className="col-md-2 col-sm-4">
                                    <h5>Avg. Sale</h5>
                                    <h4>
                                        {isNaN(collection.averagePrice) ?
                                            "N/A"
                                            :
                                            ethers.utils.commify(Number(collection.averagePrice).toFixed(0)) + " CRO"
                                        }
                                    </h4>
                                </div>
                                <div className="col-md-2 col-sm-4">
                                    <h5>Royalty</h5>
                                    <h4>{royalty}%</h4>
                                </div>
                                <div className="col-md-2 col-sm-4">
                                    <h5>Active Listings</h5>
                                    <h4>{ethers.utils.commify(collection.numberActive)}</h4>
                                </div>
                            </div>
                        </a>
                    </div>
                    )}
                    <div className='col-lg-12'>
                        <TopFilterBar showFilter={false}/>
                    </div>
                </div>
                <ListingCollection collectionId={address}/>
            </section>


            <Footer/>
        </div>
    );
};
export default Collection;