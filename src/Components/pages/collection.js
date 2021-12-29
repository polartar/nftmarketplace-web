import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";

import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';
import {
    knownContracts,
    init,
    fetchListings,
    getStats,
    filterListingsByTrait
} from '../../GlobalState/collectionSlice'
import {Contract, ethers} from "ethers";
import config from '../../Assets/networks/rpc_config.json'
import Market from '../../Contracts/Marketplace.json'
import Blockies from 'react-blockies';
import {toast} from "react-toastify";
import {humanize, siPrefixedNumber} from "../../utils";
import {Accordion, Form} from "react-bootstrap";
import CollectionListingsGroup from "../components/CollectionListingsGroup";
import CollectionFilterBar from "../components/CollectionFilterBar";

const GlobalStyles = createGlobalStyle`
`;

const Collection = ({cacheName = 'collection'}) => {
    const { address } = useParams();
    const dispatch = useDispatch();

    const readProvider = new ethers.providers.JsonRpcProvider(config.read_rpc);
    const readMarket = new Contract(config.market_contract, Market.abi, readProvider);

    const[royalty, setRoyalty] = useState(null);
    const[metadata, setMetadata] = useState(null);

    const collectionCachedTraitsFilter = useSelector((state) => state.collection.cachedTraitsFilter);
    const collectionCachedSort = useSelector((state) => state.collection.cachedSort);
    const collectionStats = useSelector((state) => state.collection.stats);

    const listings = useSelector((state) => state.collection.listings);
    const hasRank = useSelector((state) => state.collection.hasRank);
    const canLoadMore = useSelector((state) => {
        return state.collection.listings.length > 0 &&
            (state.collection.query.page === 0 || state.collection.query.page < state.collection.totalPages);
    });

    const collectionName = () => {
        const contract = knownContracts.find(c => c.address.toUpperCase() === address.toUpperCase());

        return contract ? contract.name : 'Collection';
    }

    const handleCopy = (code) => () =>{
        navigator.clipboard.writeText(code);
        toast.success('Copied!');
    }

    const handleCheck = (event, traitCategory) => {
        const { id, checked } = event.target;

        const cachedTraitsFilter = collectionCachedTraitsFilter[address] || {};

        dispatch(filterListingsByTrait({
            traits: {
                ...cachedTraitsFilter,
                [traitCategory]: {
                    ...cachedTraitsFilter[traitCategory] || {},
                    [id]: checked
                }
            },
            address
        }))
    }

    const hasTraits = () => {
        return collectionStats?.traits != null;
    }

    const loadMore = () => {
        dispatch(fetchListings());
    }

    const traitStatName = (name, stats) => {
        let ret = humanize(name);
        if (stats && stats.count > 0) {
            ret = ret.concat(` (${stats.count})`);
        }

        return ret;
    }

    useEffect(async () => {

        const defaultSort = {
            type: 'listingId',
            direction: 'desc'
        }

        const defaultAttributeFilter = {}

        const cachedTraitsFilter = collectionCachedTraitsFilter[address] || {};
        const cachedSort = collectionCachedSort[cacheName];

        dispatch(init(
            address,
            cachedSort ? cachedSort : defaultSort,
            cachedTraitsFilter ? cachedTraitsFilter : defaultAttributeFilter
        ));
        dispatch(fetchListings());

    }, [dispatch, address]);

    useEffect(() => {
        let extraData = knownContracts.find(c => c.address.toUpperCase() === address.toUpperCase());
        if (extraData) {
            setMetadata(extraData.metadata);
        }
    }, [address]);

    useEffect(async () => {
        dispatch(getStats(address));
        let royalties = await readMarket.royalties(address)
        setRoyalty((royalties[1] / 10000) * 100);
    }, [dispatch, address]);

    useEffect(async () => {
        const cachedTraitsFilter = collectionCachedTraitsFilter[address] || {};

        const count = Object.values(cachedTraitsFilter)
            .reduce((prevCount, traitCategoryObj) => {
                const truthyValues = Object.values(traitCategoryObj).filter(x => x === true);
                return prevCount + truthyValues.length
            }, 0);

        if (count > 0) {
            dispatch(filterListingsByTrait(cachedTraitsFilter));
        }
    }, [collectionCachedTraitsFilter]);

    const viewGetDefaultCheckValue = (traitCategory, id) => {
        const cachedTraitsFilter = collectionCachedTraitsFilter[address] || {};

        if (!cachedTraitsFilter || !cachedTraitsFilter[traitCategory]) {
            return false;
        }

        return cachedTraitsFilter[traitCategory][id] || false;
    };

    const viewTraitsList = () => {
        if (!collectionStats || !collectionStats.traits) {
            return [];
        }

        return Object.entries(collectionStats.traits);
    }

    const viewSelectedAttributesCount = () => {
        const cachedTraitsFilter = collectionCachedTraitsFilter[address] || {};
        return Object.values(cachedTraitsFilter)
            .map(traitCategoryValue => Object.values(traitCategoryValue).filter(x => x === true).length)
            .reduce((prev, curr) => prev + curr, 0);
    };


    return (
        <div>
            <GlobalStyles/>

            <section id='profile_banner' className='jumbotron breadcumb no-bg' style={{backgroundImage: `url(${metadata?.banner ? metadata.banner : '/img/background/subheader.jpg'})`}}>
                <div className='mainbreadcumb'>
                </div>
            </section>

            <section className='container d_coll no-top no-bottom'>
                <div className='row'>
                    <div className="col-md-12">
                        <div className="d_profile">
                            {collectionStats&&
                            <div className="profile_avatar">
                                <div className="d_profile_img">
                                    {metadata?.avatar ?
                                        <img src={metadata.avatar} alt=""/>
                                        :
                                        <Blockies seed={address.toLowerCase()} size={15} scale={10}/>
                                    }
                                    {metadata?.verified &&
                                        <i className="fa fa-check"/>
                                    }
                                </div>

                                <div className="profile_name">
                                    <h4>
                                        {collectionName()}
                                        <div className="clearfix"/>
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
                    {collectionStats && (
                        <div className="row">
                            {hasRank &&
                                <div className="row">
                                    <div className="col-lg-8 col-sm-10 mx-auto text-end fst-italic" style={{fontSize: '0.8em'}}>
                                        Rarity scores and ranks provided by <a href="https://raritysniper.com/" target="_blank"><span className="color">Rarity Sniper</span></a>
                                    </div>
                                </div>
                            }
                            <div className="d-item col-lg-8 col-sm-10 mb-4 mx-auto">
                                <a className="nft_attr">
                                    <div className="row">
                                        <div className="col-md-2 col-xs-4">
                                            <h5>Floor</h5>
                                            <h4>{siPrefixedNumber(Number(collectionStats.floorPrice).toFixed(0))} CRO</h4>
                                        </div>
                                        <div className="col-md-2 col-xs-4">
                                            <h5>Volume</h5>
                                            <h4>{siPrefixedNumber(Number(collectionStats.totalVolume).toFixed(0))} CRO</h4>
                                        </div>
                                        <div className="col-md-2 col-xs-4">
                                            <h5>Sales</h5>
                                            <h4>{siPrefixedNumber(collectionStats.numberOfSales)}</h4>
                                        </div>
                                        <div className="col-md-2 col-xs-4">
                                            <h5>Avg. Sale</h5>
                                            <h4>
                                                {isNaN(collectionStats.averageSalePrice) ?
                                                    "N/A"
                                                    :
                                                    siPrefixedNumber(Number(collectionStats.averageSalePrice).toFixed(0)) + " CRO"
                                                }
                                            </h4>
                                        </div>
                                        <div className="col-md-2 col-xs-4">
                                            <h5>Royalty</h5>
                                            <h4>{royalty}%</h4>
                                        </div>
                                        <div className="col-md-2 col-xs-4">
                                            <h5>Active Listings</h5>
                                            <h4>{siPrefixedNumber(collectionStats.numberActive)}</h4>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    )}
                <div className='row'>
                    <CollectionFilterBar showFilter={false} cacheName={cacheName}/>
                </div>
                <div className="row">
                    {hasTraits() &&
                        <div className='col-md-3'>
                            <h3>Attributes { viewSelectedAttributesCount() ? `(${viewSelectedAttributesCount()} selected)` : '' }</h3>
                            <Accordion>
                                {viewTraitsList().map(([traitCategoryName, traitCategoryValues], key) => (
                                    <Accordion.Item eventKey={key} key={key}>
                                        <Accordion.Header>{traitCategoryName}</Accordion.Header>
                                        <Accordion.Body>
                                            {Object.entries(traitCategoryValues).filter(t => t[1].count > 0).sort((a, b) => (a[0] > b[0]) ? 1 : -1).map((stats) => (
                                                <div key={`${traitCategoryName}-${stats[0]}`}>
                                                    <Form.Check
                                                        type="checkbox"
                                                        id={stats[0]}
                                                        label={traitStatName(stats[0], stats[1])}
                                                        defaultChecked={viewGetDefaultCheckValue(traitCategoryName, stats[0])}
                                                        value={viewGetDefaultCheckValue(traitCategoryName, stats[0])}
                                                        onChange={(t) => handleCheck(t, traitCategoryName)}
                                                    />
                                                </div>
                                            ))}
                                        </Accordion.Body>
                                    </Accordion.Item>
                                ))}
                            </Accordion>
                        </div>
                    }
                    <div className={hasTraits() ? 'col-md-9' : 'col-md-12'}>
                        <CollectionListingsGroup
                            listings={listings}
                            canLoadMore={canLoadMore}
                            loadMore={loadMore}
                        />
                    </div>
                </div>
            </section>

            <Footer/>
        </div>
    );
};
export default Collection;
