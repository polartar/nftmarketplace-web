import React, { memo, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';
import { getListingDetails } from "../../GlobalState/listingSlice";
import { humanize } from "../../utils";
import { useParams, useHistory  } from "react-router-dom";

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
      background: #403f83;
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
    const loading = useSelector((state) => state.listing.loading)

    const [openCheckout, setOpenCheckout] = React.useState(false);

    useEffect(() => {
        dispatch(getListingDetails(id));
    }, [dispatch, id]);

    const viewCollection = (listing) => () => {
        history.push(`/collection/${listing.nftAddress}`);
    }

    const viewSeller = (listing) => () => {
        history.push(`/seller/${listing.seller}`);
    }

    return (
        <div>
        <GlobalStyles/>
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
                            <h3>{listing.price} CRO</h3>
                            <p>{listing.nft.description}</p>
                            <div className="d-flex flex-row mt-5">
                                <button className='btn-main lead mb-3 mr15'
                                        onClick={viewCollection(listing)}>More From Collection
                                </button>
                                <button className='btn-main lead mb-3 mr15'
                                        onClick={viewSeller(listing)}>More From Seller
                                </button>
                            </div>
                            <div className="de_tab">

                                <div className="de_tab_content">
                                    <div className="tab-1 onStep fadeIn">
                                        <div className="d-block mb-3">
                                            <div className="row mt-5">
                                                {listing.nft.attributes && listing.nft.attributes.map((data, i) => {
                                                    return (
                                                        <div className="col-lg-4 col-md-6 col-sm-6">
                                                            <a className="nft_attr">
                                                                <h5>{humanize(data.trait_type)}</h5>
                                                                <h4>{humanize(data.value)}</h4>
                                                                {data.score && (
                                                                    <span>{Math.round(data.score)}% have this trait</span>
                                                                )}
                                                            </a>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                        </div>
                                    </div>

                                    {/* button for checkout */}
                                    <div className="d-flex flex-row mt-5">
                                        <button className='btn-main lead mb-5 mr15'
                                                onClick={() => setOpenCheckout(true)}>Buy Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        }
                </div>
            </div>
        </section>
        <Footer /> 
        { openCheckout &&
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
                    10.67856 ETH
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