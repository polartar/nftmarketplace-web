import React, { memo, useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';
import {getListingDetails, listingReceived} from "../../GlobalState/listingSlice";
import { humanize } from "../../utils";
import { useParams, useHistory  } from "react-router-dom";
import {ethers} from "ethers";
import MetaMaskOnboarding from '@metamask/onboarding';
import { connectAccount, chainConnect } from '../../GlobalState/User'
import {Alert, Spinner} from "react-bootstrap"
import { Helmet } from "react-helmet";
import { toast } from 'react-toastify';
import Blockies from "react-blockies";
import config from "../../Assets/networks/rpc_config.json";
const knownContracts = config.known_contracts;

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.white {
    background-color: #ff9421;
    border-bottom: solid 1px #dddddd;
  }
  header#myHeader.navbar .search #quick_search{
    color: #fff;
    background: rgba(255, 255, 255, .1);
  }
  header#myHeader.navbar.white .btn, .navbar.white a, .navbar.sticky.white a{
    color: #fff;
  }
  .mr40{
    margin-right: 40px;
  }
  .mr15{
    margin-right: 15px;
  }
  .btn2{
    background: #f6f6f6;
    color: #8364E2 !important;
  }
  @media only screen and (max-width: 1199px) {
    .navbar{
      background: #ff7814;
    }
    .navbar .menu-line, .navbar .menu-line1, .navbar .menu-line2{
      background: #111;
    }
    .item-dropdown .dropdown a{
      color: #111 !important;
    }
  }
`;



const Listing = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();

    const listing = useSelector((state) => state.listing.listing)
    const isLoading = useSelector((state) => state.listing.loading)
    const user = useSelector((state) => state.user)
    const collectionName = useSelector((state) => {
        return knownContracts.find(c => c.address === listing?.nftAddress)?.name;
    })
    const collectionAvatar = useSelector((state) => {
        let contract = knownContracts.find(c => c.address === listing?.nftAddress);
        if (contract && contract.metadata?.avatar) {
            return contract.metadata.avatar;
        } else {
            return null;
        }
    })

    const [openCheckout, setOpenCheckout] = React.useState(false);
    const [buying, setBuying] = useState(false);

    useEffect(() => {
        dispatch(getListingDetails(id));
    }, [dispatch, id]);

    const viewCollection = () => () => {
        history.push(`/collection/${listing.nftAddress}`);
    }

    const viewSeller = () => () => {
        history.push(`/seller/${listing.seller}`);
    }

    const showBuy = () => async () => {
        if(user.address){
            setBuying(true);
            try{
                let price = listing.price;
                if(typeof price === 'string' ){
                    price = ethers.utils.parseEther(price);
                }
                console.log(user.marketContract, listing.listingId, listing.price, price);
                const tx = await user.marketContract.makePurchase(listing.listingId, {
                    'value' : price
                });
                const receipt = await tx.wait();
                dispatch(listingReceived({
                    ...listing,
                    'state' : 1,
                    'purchaser' : user.address
                }));
                toast.success(`Success! ${receipt.hash}`);
            }catch(error){
                if(error.data){
                    toast.error(error.data.message);
                } else if(error.message){
                    toast.error(error.message);
                } else {
                    console.log(error);
                    toast.error("Unknown Error");
                }
            }finally{
                setBuying(false);
            }
        } else{
            if(user.needsOnboard){
                const onboarding = new MetaMaskOnboarding();
                onboarding.startOnboarding();
            } else if(!user.address){
                dispatch(connectAccount());
            } else if(!user.correctChain){
                dispatch(chainConnect());
            }
        }

    }

    return (
        <div>
            <GlobalStyles/>
            {listing &&
            <Helmet>
                <title>Ebisu's Bay | {listing.nft.name}</title>
                <meta name='description' content={listing.nft.description} />
                <meta property='og:locale' content='en_US' />
                <meta property='og:type' content='website' />
                <meta property='og:title' content={listing.nft.name} />
                <meta property='og:description' content={listing.nft.description} />
                <meta property='og:image' content={listing.nft.image} />
                <meta property='og:url' content={'https://app.ebisusbay.com/listing/'+id} />
                {/*<meta name='twitter:card' content='summary_large_image' />*/}
                <meta name='twitter:site' content='@EbisusBay' />
                <meta name='twitter:creator' content='@EbisusBay' />
            </Helmet>
            }
            {isLoading ?
                <section className='container'>
                    <div className='row mt-4'>
                        <div className='col-lg-12 text-center'>
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>
                    </div>
                </section>
                :
                <section className='container'>
                    <div className='row mt-md-5 pt-md-4'>
                        <div className="col-md-6 text-center">
                            {listing &&
                            <img src={listing.nft.image} className="img-fluid img-rounded mb-sm-30" alt=""/>
                            }
                        </div>
                        <div className="col-md-6">
                            {listing &&
                            <div className="item_info">
                                <h2>{listing.nft.name}</h2>
                                <h3>{ethers.utils.commify(listing.price)} CRO</h3>
                                <p>{listing.nft.description}</p>
                                <div className="row">
                                    <div className="col">
                                        <h6>Seller</h6>
                                        <div className="item_author">
                                            <div className="author_list_pp">
                                            <span onClick={viewSeller()}>
                                                <Blockies seed={listing.seller} size={10} scale={5}/>
                                            </span>
                                            </div>
                                            <div className="author_list_info">
                                                <span>{`${listing.seller.substring(0, 4)}...${listing.seller.substring(listing.seller.length-3, listing.seller.length)}`}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <h6>Collection</h6>
                                        <div className="item_author">
                                            <div className="author_list_pp">
                                            <span onClick={viewCollection()}>
                                                {collectionAvatar ?
                                                    <img className="lazy" src={collectionAvatar} alt=""/>
                                                    :
                                                    <Blockies seed={listing.nftAddress} size={10} scale={5}/>
                                                }
                                            </span>
                                            </div>
                                            <div className="author_list_info">
                                                <span>{collectionName ?? "View Collection"}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {(typeof listing.nft.rank !== 'undefined' && listing.nft.rank !== null) &&
                                        <div className="col">
                                            <h6>Rarity Sniper Rank</h6>
                                            <div className="item_author">
                                                <div className="author_list_info">
                                                    <span>{listing.nft.rank}</span>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                                <div className="de_tab">

                                    <div className="de_tab_content">
                                        <div className="tab-1 onStep fadeIn">
                                            <div className="d-block mb-3">
                                                <div className="row mt-5">
                                                    {listing.nft.attributes && listing.nft.attributes.map((data, i) => {
                                                        return (
                                                            <div key={i} className="col-lg-4 col-md-6 col-sm-6">
                                                                <a className="nft_attr">
                                                                    <h5>{humanize(data.trait_type)}</h5>
                                                                    <h4>{humanize(data.value)}</h4>
                                                                    {data.occurrence ? (
                                                                            <span>{Math.round(data.occurrence * 100)}% have this trait</span>
                                                                        )
                                                                    :
                                                                        data.percent && (
                                                                            <span>{data.percent}% have this trait</span>
                                                                        )
                                                                    }
                                                                </a>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                            </div>
                                        </div>

                                        {/* button for checkout */}
                                        {listing.state === 0 ?
                                            <div className="d-flex flex-row mt-5">
                                                <button className='btn-main lead mb-5 mr15'
                                                        onClick={showBuy()}>Buy Now
                                                </button>
                                            </div> :
                                            <div>LISTING HAS BEEN {(listing.state === 1) ? 'SOLD' : 'CANCELLED' }</div>
                                        }
                                    </div>
                                </div>
                            </div>
                            }
                        </div>
                    </div>
                </section>
            }

        <Footer /> 
        { openCheckout && user &&
        <div className='checkout'>
            <div className='maincheckout'>
            <button className='btn-close' onClick={() => setOpenCheckout(false)}>x</button>
                <div className='heading'>
                    <h3>Checkout</h3>
                </div>
              <p>You are about to purchase a <span className="bold">{listing.nft.name}</span></p>
                <div className='heading mt-3'>
                    <p>Your balance</p>
                    <div className='subtotal'>
                        {ethers.utils.formatEther(user.balance)} CRO
                    </div>
                </div>
              <div className='heading'>
                <p>Service fee 2.5%</p>
                <div className='subtotal'>
                0.00325 ETH
                </div>
              </div>
              <div className='heading'>
                <p>You will pay</p>
                <div className='subtotal'>
                0.013325 ETH
                </div>
              </div>
                <button className='btn-main lead mb-5'>Checkout</button>
            </div>
        </div>
        }

        </div>
    );
}

export default memo(Listing);