import React, {useEffect, useLayoutEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";

import ListingCollection from '../components/ListingCollection';
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';
import TopFilterBar from '../components/TopFilterBar';
import { knownContracts, getCollectionData } from '../../GlobalState/marketplaceSlice'
import {Contract, ethers} from "ethers";
import config from '../../Assets/networks/rpc_config.json'
import Market from '../../Contracts/Marketplace.json'
import Blockies from 'react-blockies';
import {toast} from "react-toastify";

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

const Collection = () => {
    const { address } = useParams();
    const dispatch = useDispatch();

    const readProvider = new ethers.providers.JsonRpcProvider(config.read_rpc);
    const readMarket = new Contract(config.market_contract, Market.abi, readProvider);
    const[royalty, setRoyalty] = useState(null);

    const collection = useSelector((state) => {
        return state.marketplace.collection;
    });

    const collectionName = () => {
        const contract = knownContracts.find(c => c.address.toUpperCase() === address.toUpperCase());

        return contract ? contract.name : 'Collection';
    }

    const[metadata, setMetadata] = useState(null);

    const handleCopy = (code) => () =>{
        navigator.clipboard.writeText(code);
        toast.success('Copied!');
    }

    useEffect(() => {
        let contract = knownContracts.find(c => c.address.toUpperCase() === address.toUpperCase());
        if (contract) {
            setMetadata(contract.metadata);
        }
    });

    useEffect(async () => {
        dispatch(getCollectionData(address));
        let royalties = await readMarket.royalties(address)
        setRoyalty((royalties[1] / 10000) * 100);
    }, [dispatch, address]);

    return (
        <div>
            <GlobalStyles/>

            <section id='profile_banner' className='jumbotron breadcumb no-bg' style={{backgroundImage: `url(${metadata?.banner ? metadata.banner : '/img/background/subheader.png'})`}}>
                <div className='mainbreadcumb'>
                </div>
            </section>

            <section className='container d_coll no-top no-bottom'>
                <div className='row'>
                    <div className="col-md-12">
                        <div className="d_profile">
                            {collection &&
                            <div className="profile_avatar">
                                <div className="d_profile_img">
                                    {metadata?.avatar ?
                                        <img src={metadata.avatar} alt=""/>
                                        :
                                        <Blockies seed={collection.address} size={15} scale={10}/>
                                    }
                                    {metadata?.verified &&
                                        <i className="fa fa-check"></i>
                                    }
                                </div>

                                <div className="profile_name">
                                    <h4>
                                        {collectionName()}
                                        <div className="clearfix"></div>
                                        <span id="wallet" className="profile_wallet">{address}</span>

                                        <button id="btn_copy" title="Copy Text" onClick={handleCopy(address)}>Copy</button>
                                    </h4>
                                </div>
                            </div>
                            }
                        </div>
                    </div>
                </div>
            </section>

            <section className='container no-top'>
                <div className='row'>
                    {collection && (
                    <div className="d-item col-lg-8 col-sm-10 mb-4 mx-auto">
                        <a className="nft_attr">
                            <div className="row">
                                <div className="col-md-2 col-xs-4">
                                    <h5>Floor</h5>
                                    <h4>{ethers.utils.commify(Number(collection.floorPrice).toFixed(0))} CRO</h4>
                                </div>
                                <div className="col-md-2 col-xs-4">
                                    <h5>Volume</h5>
                                    <h4>{ethers.utils.commify(Number(collection.totalVolume).toFixed(0))} CRO</h4>
                                </div>
                                <div className="col-md-2 col-xs-4">
                                    <h5>Sales</h5>
                                    <h4>{ethers.utils.commify(collection.numberOfSales)}</h4>
                                </div>
                                <div className="col-md-2 col-xs-4">
                                    <h5>Avg. Sale</h5>
                                    <h4>
                                        {isNaN(collection.averageSalePrice) ?
                                            "N/A"
                                            :
                                            ethers.utils.commify(Number(collection.averageSalePrice).toFixed(0)) + " CRO"
                                        }
                                    </h4>
                                </div>
                                <div className="col-md-2 col-xs-4">
                                    <h5>Royalty</h5>
                                    <h4>{royalty}%</h4>
                                </div>
                                <div className="col-md-2 col-xs-4">
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