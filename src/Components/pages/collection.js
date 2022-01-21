import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from "react-router-dom";

import Footer from '../components/Footer';
import { createGlobalStyle } from 'styled-components';
import {
    init,
    fetchListings,
    getStats,
} from '../../GlobalState/collectionSlice'
import {Contract, ethers} from "ethers";
import config from '../../Assets/networks/rpc_config.json'
import Market from '../../Contracts/Marketplace.json'
import Blockies from 'react-blockies';
import {toast} from "react-toastify";
import {siPrefixedNumber} from "../../utils";
import CollectionListingsGroup from "../components/CollectionListingsGroup";
import CollectionFilterBar from "../components/CollectionFilterBar";
import TraitsFilter from "../Collection/TraitsFilter";
import PowertraitsFilter from "../Collection/PowertraitsFilter";
import { SortOption } from '../Models/sort-option.model';
import { FilterOption } from "../Models/filter-option.model";
import {faCheck, faCircle} from "@fortawesome/free-solid-svg-icons";
import LayeredIcon from "../components/LayeredIcon";

const knownContracts = config.known_contracts;

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

    const collectionMetadata = useSelector((state) => {
        return knownContracts.find(c => c.address.toLowerCase() === address.toLowerCase())?.metadata;
    });

    const collectionName = () => {
        const contract = knownContracts.find(c => c.address.toLowerCase() === address.toLowerCase());

        return contract ? contract.name : 'Collection';
    }

    const handleCopy = (code) => () =>{
        navigator.clipboard.writeText(code);
        toast.success('Copied!');
    }

    const hasTraits = () => {
        return collectionStats?.traits != null;
    }

    const hasPowertraits = () => {
        return collectionStats?.powertraits != null;
    }

    const loadMore = () => {
        dispatch(fetchListings());
    }

    useEffect(async () => {
        const sortOption = SortOption.default();
        sortOption.key = 'listingId';
        sortOption.direction = 'desc';
        sortOption.label = 'By Id';

        const filterOption = FilterOption.default();
        filterOption.type = 'collection';
        filterOption.address = address;
        filterOption.name = 'Specific collection';

        dispatch(init(
            filterOption,
            collectionCachedSort[cacheName] ?? sortOption,
            collectionCachedTraitsFilter[address] ?? {},
            address
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
        try {
            let royalties = await readMarket.royalties(address)
            setRoyalty(Math.round(royalties[1]) / 100);
        } catch (error) {
            console.log('error retrieving royalties for collection', error)
            setRoyalty('N/A');
        }
    }, [dispatch, address]);

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
                                        <LayeredIcon
                                            icon={faCheck}
                                            bgIcon={faCircle}
                                            shrink={8}
                                        />
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
                            {hasRank && collectionMetadata?.rarity === 'rarity_sniper' &&
                                <div className="row">
                                    <div className="col-lg-8 col-sm-10 mx-auto text-end fst-italic" style={{fontSize: '0.8em'}}>
                                        Rarity scores and ranks provided by <a href="https://raritysniper.com/" target="_blank"><span className="color">Rarity Sniper</span></a>
                                    </div>
                                </div>
                            }
                            <div className="d-item col-lg-8 col-sm-10 mb-4 mx-auto">
                                <div className="nft_attr">
                                    <div className="row">
                                        <div className="col-md-2 col-xs-4">
                                            <h5>Floor</h5>
                                            {collectionStats.floorPrice ?
                                                <h4>{siPrefixedNumber(Number(collectionStats.floorPrice).toFixed(0))} CRO</h4>
                                                :
                                                <h4>-</h4>
                                            }
                                        </div>
                                        <div className="col-md-2 col-xs-4">
                                            <h5>Volume</h5>
                                            {collectionStats.totalVolume ?
                                                <h4>{siPrefixedNumber(Number(collectionStats.totalVolume).toFixed(0))} CRO</h4>
                                                :
                                                <h4>-</h4>
                                            }
                                        </div>
                                        <div className="col-md-2 col-xs-4">
                                            <h5>Sales</h5>
                                            {collectionStats.numberOfSales ?
                                                <h4>{siPrefixedNumber(collectionStats.numberOfSales)}</h4>
                                                :
                                                <h4>-</h4>
                                            }
                                        </div>
                                        <div className="col-md-2 col-xs-4">
                                            <h5>Avg. Sale</h5>
                                            {collectionStats.averageSalePrice ?
                                                <h4>{siPrefixedNumber(Number(collectionStats.averageSalePrice).toFixed(0))} CRO</h4>
                                                :
                                                <h4>-</h4>
                                            }
                                        </div>
                                        <div className="col-md-2 col-xs-4">
                                            <h5>Royalty</h5>
                                            {royalty ?
                                                <h4>{royalty}%</h4>
                                                :
                                                <h4>-</h4>
                                            }
                                        </div>
                                        <div className="col-md-2 col-xs-4">
                                            <h5>Active Listings</h5>
                                            {collectionStats.numberActive ?
                                                <h4>{siPrefixedNumber(collectionStats.numberActive)}</h4>
                                                :
                                                <h4>-</h4>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                <div className='row'>
                    <CollectionFilterBar showFilter={false}
                                         cacheName={cacheName}

                    />
                </div>
                <div className="row">
                    {(hasTraits() || hasPowertraits()) &&
                        <div className='col-md-3 mb-4'>
                            {hasTraits() &&
                                <TraitsFilter address={address} />
                            }
                            {hasPowertraits() &&
                                <PowertraitsFilter address={address} />
                            }
                        </div>
                    }
                    <div className={hasTraits() || hasPowertraits() ? 'col-md-9' : 'col-md-12'}>
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
