import React, { memo, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';
import {humanize, shortAddress, timeSince} from "../../utils";
import {useParams, useHistory, Link} from "react-router-dom";
import {getNftDetails} from "../../GlobalState/nftSlice";
import Blockies from "react-blockies";
import config from "../../Assets/networks/rpc_config.json";
import {ethers} from "ethers";
const knownContracts = config.known_contracts;

const GlobalStyles = createGlobalStyle`
`;

const Nft = () => {
    const { address, id } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();

    const nft = useSelector((state) => state.nft.nft)
    const listings = useSelector((state) => state.nft.history.filter(i => i.state === 1))
    const collectionMetadata = useSelector((state) => {
        return knownContracts.find(c => c.address.toLowerCase() === address.toLowerCase())?.metadata;
    });
    const collectionName = useSelector((state) => {
        return knownContracts.find(c => c.address.toLowerCase() === address.toLowerCase())?.name;
    });

    useEffect(() => {
        dispatch(getNftDetails(address, id));
    }, [dispatch, id]);

    const viewSeller = (seller) => () => {
        history.push(`/seller/${seller}`);
    }

    const fullImage = () => {
        if (nft.original_image.startsWith('ipfs://')) {
            const link = nft.original_image.split('://')[1];
            return `https://ipfs.io/ipfs/${link}`;
        }

        return nft.original_image;
    }

    const [openMenu, setOpenMenu] = React.useState(0);
    const handleBtnClick = (index) => (element) => {
        var elements = document.querySelectorAll('.tab');
        for (var i = 0; i < elements.length; i++) {
            elements[i].classList.remove('active');
        }
        element.target.parentElement.classList.add("active");

        setOpenMenu(index);
        console.log(openMenu, index);
    };

    return (
        <div>
        <GlobalStyles/>
            <section className='container'>
                <div className='row mt-md-5 pt-md-4'>
                    <div className="col-md-6 text-center">
                        {nft &&
                            <img src={nft.image} className="img-fluid img-rounded mb-sm-30" alt=""/>
                        }
                        {nft && nft.original_image &&
                            <div className="nft__item_action mt-2" style={{cursor: 'pointer'}}>
                                <span onClick={() => window.open(fullImage(), "_blank")}>
                                    View Full Image <i className="fa fa-external-link"></i>
                                </span>
                            </div>
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
                                        <Link to={`/collection/${address}`}>
                                            <div className="author_list_pp">
                                                <span>
                                                    {collectionMetadata?.avatar ?
                                                        <img className="lazy" src={collectionMetadata.avatar} alt=""/>
                                                        :
                                                        <Blockies seed={address} size={10} scale={5}/>
                                                    }
                                                    {collectionMetadata?.verified &&
                                                        <i className="fa fa-check"></i>
                                                    }
                                                </span>
                                            </div>
                                        </Link>
                                        <div className="author_list_info">
                                            <span>{collectionName ?? "View Collection"}</span>
                                        </div>
                                    </div>
                                </div>
                                {(typeof nft.rank !== 'undefined' && nft.rank !== null) &&
                                <div className="col">
                                    {collectionMetadata?.rarity ?
                                        <h6>{humanize(collectionMetadata.rarity)} Rank</h6>
                                        :
                                        <h6>Rarity Rank</h6>
                                    }
                                    <div className="item_author">
                                        <div className="author_list_info">
                                            <span>{nft.rank}</span>
                                        </div>
                                    </div>
                                </div>
                                }
                            </div>

                            <div className="spacer-40"></div>

                            <div className="de_tab">

                                <ul className="de_nav">
                                    <li id='Mainbtn0' className="tab active"><span onClick={handleBtnClick(0)}>Details</span></li>
                                    <li id='Mainbtn1' className="tab"><span onClick={handleBtnClick(1)}>History</span></li>
                                </ul>

                                <div className="de_tab_content">
                                    {openMenu === 0 &&
                                    <div className="tab-1 onStep fadeIn">
                                        {(nft.attributes && nft.attributes.length > 0) ||  (nft.properties && nft.properties.length > 0) ?
                                            <div className="d-block mb-3">
                                                <div className="row mt-5 gx-3 gy-2">
                                                    {nft.attributes && nft.attributes.map((data, i) => {
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
                                                    {nft.properties && nft.properties.map((data, i) => {
                                                        return (
                                                            <div key={i} className="col-lg-4 col-md-6 col-sm-6">
                                                                <div className="nft_attr">
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
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                            </div>
                                            :
                                            <>
                                                <span>No traits found for this item</span>
                                            </>
                                        }
                                    </div>
                                    }
                                    {openMenu === 1 &&
                                        <div className="tab-2 onStep fadeIn">
                                            {listings && listings.length > 0 ?
                                                <>
                                                    {listings.map((listing, index) => (
                                                        <div className="p_list" key={index}>
                                                            <Link to={`/seller/${listing.purchaser}`}>
                                                                <div className="p_list_pp">
                                                                    <span>
                                                                        <span onClick={viewSeller(listing.purchaser)}>
                                                                            <Blockies seed={listing.purchaser} size={10} scale={5}/>
                                                                        </span>
                                                                    </span>
                                                                </div>
                                                            </Link>
                                                            <div className="p_list_info">
                                                                <span>{timeSince(listing.saleTime + "000")} ago</span>
                                                                Bought by <b><Link to={`/seller/${listing.purchaser}`}>{shortAddress(listing.purchaser)}</Link></b> for <b>{ethers.utils.commify(listing.price)} CRO</b>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </>
                                            :
                                                <>
                                                    <span>No history found for this item</span>
                                                </>
                                            }

                                        </div>
                                    }
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