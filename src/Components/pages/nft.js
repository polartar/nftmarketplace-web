import React, { memo, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';
import { getListingDetails } from "../../GlobalState/listingSlice";
import { humanize } from "../../utils";
import { useParams, useHistory  } from "react-router-dom";
import {getNftDetails} from "../../GlobalState/nftSlice";
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

const Nft = () => {
    const { address, id } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();

    const nft = useSelector((state) => state.nft.nft)
    const collectionName = useSelector((state) => {
        return knownContracts.find(c => c.address === address)?.name;
    })
    const collectionAvatar = useSelector((state) => {
        let contract = knownContracts.find(c => c.address === address);
        if (contract && contract.metadata?.avatar) {
            return contract.metadata.avatar;
        } else {
            return null;
        }
    })

    useEffect(() => {
        dispatch(getNftDetails(address, id));
    }, [dispatch, id]);

    const viewCollection = () => () => {
        history.push(`/collection/${address}`);
    }

    return (
        <div>
        <GlobalStyles/>
            <section className='container'>
                <div className='row mt-md-5 pt-md-4'>
                    <div className="col-md-6 text-center">
                        {nft &&
                        <img src={nft.image} className="img-fluid img-rounded mb-sm-30" alt=""/>
                        }
                    </div>
                    <div className="col-md-6">
                        {nft &&
                        <div className="item_info">
                            <h2>{nft.name}</h2>
                            <p>{nft.description}</p>
                            <div className="row">
                                <div className="col">
                                    <h6>Collection</h6>
                                    <div className="item_author">
                                        <div className="author_list_pp">
                                            <span onClick={viewCollection()}>
                                                {collectionAvatar ?
                                                    <img className="lazy" src={collectionAvatar} alt=""/>
                                                    :
                                                    <Blockies seed={address} size={10} scale={5}/>
                                                }
                                            </span>
                                        </div>
                                        <div className="author_list_info">
                                            <span>{collectionName ?? "View Collection"}</span>
                                        </div>
                                    </div>
                                </div>
                                {(typeof nft.rank !== 'undefined' && nft.rank !== null) &&
                                <div className="col">
                                    <h6>Rarity Sniper Rank</h6>
                                    <div className="item_author">
                                        <div className="author_list_info">
                                            <span>{nft.rank}</span>
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
                                                {nft.attributes && nft.attributes.map((data, i) => {
                                                    return (
                                                        <div className="col-lg-4 col-md-6 col-sm-6">
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
                                </div>
                            </div>
                        </div>
                        }
                </div>
            </div>
        </section>
        <Footer />

        </div>
    );
}

export default memo(Nft);