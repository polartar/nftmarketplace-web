import React, { memo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ListingCard from './ListingCard';
import {init, fetchListings} from "../../GlobalState/auctionsSlice";
import InfiniteScroll from 'react-infinite-scroll-component';
import {Spinner} from "react-bootstrap";
import AuctionCard from "./AuctionCard";
import Clock from "./Clock";
import {Link} from "react-router-dom";
import auction from "../pages/auction";
import {auctionState} from "../../core/api/enums";

const AuctionCollection = ({ showLoadMore = true, collectionId = null , sellerId = null, cacheName = null}) => {

    const dispatch = useDispatch();
    const listings = useSelector((state) => state.auctions.auctions.filter(a => a.state !== auctionState.SOLD))

    const canLoadMore = useSelector((state) => {
        return state.marketplace.curPage === 0 || state.marketplace.curPage < state.marketplace.totalPages;
    });

    const marketplace = useSelector((state) => {
        return state.marketplace;
    });

    const isFilteredOnCollection = useSelector((state) => {
        return marketplace.curFilter !== null &&
            marketplace.curFilter.type === 'collection' &&
            marketplace.curFilter.address !== null;
    });

    useEffect(async () => {
        let sort = {
            type: 'listingId',
            direction: 'desc'
        }

        let filter = {
            type: null,
            address: null
        }

        if(collectionId){
            filter.type = 'collection';
            filter.address = collectionId;
        } else if(sellerId){
            filter.type = 'seller';
            filter.address = sellerId;
        } else {
            //  if cacheName is supplied filter and sort values remain same after changing pages.
            const cachedFilter = marketplace.cachedFilter[cacheName];
            const cachedSort = marketplace.cachedSort[cacheName];

            if (cachedFilter) {
                filter.type = cachedFilter.type;
                filter.address = cachedFilter.address;
            }

            if (cachedSort) {
                sort.type = cachedSort.type;
                sort.direction = cachedSort.direction;
            }
        }
        dispatch(init(sort, filter));
        dispatch(fetchListings());

    }, [dispatch]);

    const loadMore = () => {
        dispatch(fetchListings());
    }

    if (showLoadMore) {
        return (
            <>
                {listings?.length > 0 ?
                    <div className='card-group'>
                        {listings && listings.map( (listing, index) => (
                            <div key={index} className="d-item col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4 px-2">
                                <AuctionCard
                                    listing={listing}
                                    imgClass="marketplace"
                                />
                            </div>
                        ))}
                    </div>
                    :
                    <div className="text-center">Charity auctions will be available soon!</div>
                }
            </>
        );
    }
    else {
        return (
            <div className='row'>
                {listings?.length > 0 ?
                    <div className='card-group'>
                        {listings && listings.map( (listing, index) => (
                            <div key={index} className="d-item col-xl-3 col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4 px-2">
                                <AuctionCard
                                    listing={listing}
                                    imgClass="marketplace"
                                />
                            </div>
                        ))}
                    </div>
                    :
                    <span>Charity auctions will be available soon!</span>
                }
            </div>
        );
    }
};

export default memo(AuctionCollection);
